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
      sub: this.id,
      username: this.username,
    };
  }

  static toEntity(user: User): UserEntity {
    return new UserEntity(user.id, user.username);
  }

  static fromJWTObject(payload: JwtPayload): UserEntity {
    return new UserEntity(payload.sub, payload.username);
  }
}

export interface JwtPayload {
  sub: number;
  username: string;
}
