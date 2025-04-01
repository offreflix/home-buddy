import { User } from '@prisma/client';

export class UserEntity {
  id: number;
  username: string;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }

  toJWTObject(): JwtPayload {
    return {
      id: this.id,
      username: this.username,
    };
  }

  static toEntity(user: User): UserEntity {
    return new UserEntity(user.id, user.username);
  }

  static fromJWTObject(payload: JwtPayload): UserEntity {
    console.log('payload', payload);
    return new UserEntity(payload.id, payload.username);
  }
}

export interface JwtPayload {
  id: number;
  username: string;
}
