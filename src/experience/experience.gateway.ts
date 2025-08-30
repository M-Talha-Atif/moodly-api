// src/experience/experience.gateway.ts

import {
  WebSocketGateway, // Turns this class into a WebSocket gateway (entry point for socket.io)
  WebSocketServer, // Decorator to inject the underlying socket.io server instance
  OnGatewayConnection, // Lifecycle hook: triggered when a client connects
  OnGatewayDisconnect, // Lifecycle hook: triggered when a client disconnects
  SubscribeMessage, // Decorator to listen for specific events sent from clients
  MessageBody, // Extracts message body from client event
  ConnectedSocket, // Extracts the client socket object
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Server --> Connection establish / disconnect
// Subscribe to messages on a channel
// 👇 Decorator tells NestJS to create a WebSocket server
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // frontend
    credentials: true,
  },
})
export class ExperienceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // 👇 socket.io server instance (the "hub" where events/messages are routed)
  @WebSocketServer()
  server: Server;

  /**
   * Triggered when a client establishes a WebSocket connection
   * Equivalent of "on connect" in socket.io
   */
  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
    // You can authenticate here (check token, userId, etc.)
  }

  /**
   * Triggered when a client disconnects (closes browser, refresh, network drop, etc.)
   */
  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  /**
   * Handles when a client wants to "join" a specific experience room.
   * Example: user clicks into an experience detail page → client emits 'join-experience'
   *
   * - client joins a room (socket.io group channel)
   * - room name convention: "experience_<experienceId>"
   * - Later, we can emit events ONLY to users in this room
   */
  @SubscribeMessage('join-experience')
  handleJoinExperience(
    @MessageBody() data: { experienceId: string }, // The experience they want to join
    @ConnectedSocket() client: Socket, // The socket object of that client
  ) {
    // 👇 Join them into the specific "room" for that experience
    client.join(`experience_${data.experienceId}`);
    console.log(
      `👥 Client ${client.id} joined room experience_${data.experienceId}`,
    );

    // You could also emit back a "joined successfully" ack:
    client.emit('joined-experience', { experienceId: data.experienceId });
  }

  /**
   * This is NOT triggered by clients.
   * This is a "server → client" push method that YOU can call from services.
   *
   * Example: after someone books/cancels, BookingService/BookingCreationService can call
   * this.emitSpotsUpdate(experienceId, newSpotsLeft)
   *
   * 🔥 This will notify ONLY users in the corresponding experience room
   */
  emitSpotsUpdate(experienceId: string, spotsLeft: number) {
    // Send an event called "spots-update" to all clients in this room
    this.server.to(`experience_${experienceId}`).emit('spots-update', {
      experienceId,
      spotsLeft,
    });
    console.log(
      `📢 Broadcasted spots update for ${experienceId}: ${spotsLeft} left`,
    );
  }

  // // Add this method for booking updates
  // emitBookingUpdate(userId: string, update: any) {
  //   this.server.to(`user_${userId}`).emit('bookingUpdate', update);
  // }
}
