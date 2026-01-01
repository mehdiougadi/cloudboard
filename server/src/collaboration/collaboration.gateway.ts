import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './interfaces/user.interface';
import { JoinSessionDto } from './dto/join-session.dto';
import { CursorMoveDto } from './dto/cursor-move.dto';

@WebSocketGateway()
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CollaborationGateway.name);
  private sessions = new Map<string, Map<string, User>>();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnecting: ${client.id}`);

    this.sessions.forEach((sessionUsers, sessionId) => {
      if (sessionUsers.has(client.id)) {
        const user = sessionUsers.get(client.id);

        sessionUsers.delete(client.id);

        this.server.to(sessionId).emit('user-left', {
          socketId: client.id,
          username: user?.username,
        });

        this.logger.log(
          `User ${user?.username} (${client.id}) left session ${sessionId}`,
        );

        if (sessionUsers.size === 0) {
          this.sessions.delete(sessionId);
          this.logger.log(`Deleted empty session: ${sessionId}`);
        }
      }
    });
  }

  @SubscribeMessage('join-session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinSessionDto,
  ) {
    const { sessionId, username } = data;

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Map());
      this.logger.log(`Created new session: ${sessionId}`);
    }

    await client.join(sessionId);

    const user: User = {
      username,
      socketId: client.id,
      color: this.generateRandomColor(),
    };

    const sessionUsers = this.sessions.get(sessionId)!;
    sessionUsers.set(client.id, user);
    const existingUsers = Array.from(sessionUsers.values());
    client.emit('session-joined', { users: existingUsers, sessionId });
    client.to(sessionId).emit('user-joined', user);
    this.logger.log(`User ${username} joined session ${sessionId}`);
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CursorMoveDto,
  ) {
    const { sessionId, x, y } = data;

    const sessionUsers = this.sessions.get(sessionId);
    if (sessionUsers && sessionUsers.has(client.id)) {
      const user = sessionUsers.get(client.id)!;
      user.cursorPosition = { x, y };
    }

    client.to(sessionId).emit('cursor-moved', {
      socketId: client.id,
      x,
      y,
    });
  }

  private generateRandomColor(): string {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }
}
