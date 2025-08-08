// src/notification/notification.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendToUser(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }
}
