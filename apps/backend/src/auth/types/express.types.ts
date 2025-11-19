import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    jti?: string;
  };
}

export interface RequestWithCookies extends Omit<Request, 'cookies'> {
  cookies?: {
    access_token?: string;
    refresh_token?: string;
    [key: string]: string | undefined;
  };
}


