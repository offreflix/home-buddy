import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  PaginationOptions,
  PaginationResult,
  PaginationMetaDto,
  PaginationLinksDto,
  PaginationQueryDto,
} from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  private readonly MAX_UNLIMITED_ITEMS = 1000;
  createPaginationOptions(query: PaginationQueryDto): PaginationOptions {
    const page = Math.max(1, query.page || 1);
    const perPage =
      query.perPage === 0 ? 0 : Math.min(100, Math.max(1, query.perPage || 10));
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    return {
      page,
      perPage,
      sortBy,
      sortOrder,
    };
  }

  getMaxUnlimitedItems(): number {
    return this.MAX_UNLIMITED_ITEMS;
  }

  createPaginationMeta(
    page: number,
    perPage: number,
    total: number,
  ): PaginationMetaDto {
    if (perPage === 0) {
      return {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        from: total > 0 ? 1 : 0,
        to: total,
      };
    }

    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return {
      page,
      perPage,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      from,
      to,
    };
  }

  createPaginationLinks(
    req: Request,
    page: number,
    perPage: number,
    totalPages: number,
  ): PaginationLinksDto {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    const queryParams = new URLSearchParams(
      req.query as Record<string, string>,
    );

    const createUrl = (pageNum: number): string => {
      const params = new URLSearchParams(queryParams);
      params.set('page', pageNum.toString());
      params.set('perPage', perPage.toString());
      return `${baseUrl}?${params.toString()}`;
    };

    return {
      self: createUrl(page),
      next: page < totalPages ? createUrl(page + 1) : null,
      prev: page > 1 ? createUrl(page - 1) : null,
      first: createUrl(1),
      last: createUrl(totalPages),
    };
  }

  /**
   * Aplica paginação e ordenação aos dados
   */
  async paginate<T>(data: T[], options: PaginationOptions): Promise<T[]> {
    const { page, perPage, sortBy, sortOrder } = options;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    let sortedData = [...data];
    if (sortBy && typeof data[0] === 'object' && data[0] !== null) {
      sortedData.sort((a: T, b: T) => {
        const aValue = (a as Record<string, unknown>)[sortBy];
        const bValue = (b as Record<string, unknown>)[sortBy];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return sortedData.slice(startIndex, endIndex);
  }

  createPaginatedResponse<T>(
    data: T[],
    total: number,
    options: PaginationOptions,
    req: Request,
  ): PaginationResult<T> {
    const { page, perPage } = options;
    const meta = this.createPaginationMeta(page, perPage, total);
    const links = this.createPaginationLinks(
      req,
      page,
      perPage,
      meta.totalPages,
    );

    return {
      data,
      meta,
      links,
    };
  }

  getPrismaPaginationOptions(options: PaginationOptions): {
    skip?: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc'>;
  } {
    const { page, perPage, sortBy, sortOrder } = options;

    const baseOptions = {
      orderBy: {
        [sortBy]: sortOrder,
      } as Record<string, 'asc' | 'desc'>,
    };

    if (perPage === 0) {
      return {
        ...baseOptions,
        take: this.MAX_UNLIMITED_ITEMS,
      };
    }

    const skip = (page - 1) * perPage;

    return {
      ...baseOptions,
      skip,
      take: perPage,
    };
  }
}
