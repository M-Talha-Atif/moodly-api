// src/recommendation/recommendation.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RecommendationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  handleConnection(client: any) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`🔌 User ${userId} connected via socket`);
    }
  }

  handleDisconnect(client: any) {
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`❌ User ${userId} disconnected`);
    }
  }

  sendRecommendations(userId: string, recommendations: any[]) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('recommendations', recommendations);
      console.log(`📡 Sent recommendations to user ${userId}`);
    }
  }
}
