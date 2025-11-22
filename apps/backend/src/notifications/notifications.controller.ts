import { Controller, Sse, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.controller';
import { map, filter } from 'rxjs/operators';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('sse')
  @ApiOperation({ summary: 'Stream de eventos SSE' })
  sse(@Request() req: AuthRequest) {
    const userId = req.user.id;
    console.log(`[SSE] Cliente conectado: UserID ${userId}`);

    return this.notificationsService.eventStream$.pipe(
      map((event) => {
        console.log(`[SSE] Evento recebido no controller:`, event);
        return event;
      }),
      filter((event) => {
        const match = Number(event.userId) === Number(userId);
        console.log(
          `[SSE] Filtro: EventUser ${event.userId} vs ReqUser ${userId} -> ${match}`,
        );
        return match;
      }),
      map((event) => ({ data: { type: event.type, data: event.data } })),
    );
  }
}
