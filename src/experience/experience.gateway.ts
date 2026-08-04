import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ExperienceGateway {
  @WebSocketServer()
  server: Server;

  // Room name convention: `experience_<experienceId>`, joined by clients viewing that
  // experience's detail page so emitSpotsUpdate can target only them.
  @SubscribeMessage('join-experience')
  handleJoinExperience(
    @MessageBody() data: { experienceId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`experience_${data.experienceId}`);
    client.emit('joined-experience', { experienceId: data.experienceId });
  }

  // Called from booking services after a booking or cancellation changes spotsFilled.
  emitSpotsUpdate(experienceId: string, spotsLeft: number) {
    this.server.to(`experience_${experienceId}`).emit('spots-update', {
      experienceId,
      spotsLeft,
    });
  }
}
