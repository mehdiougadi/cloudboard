import { CursorPosition } from './cursor.interface';

export interface User {
  username: string;
  socketId: string;
  color: string;
  cursorPosition?: CursorPosition;
}
