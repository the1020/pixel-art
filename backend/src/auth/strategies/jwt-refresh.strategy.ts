import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req: Request, payload) {
    const refreshToken = req.cookies['refreshToken'];

    const refreshTokenId = await this.usersService.getRefreshTokenId(
      payload.userId,
      refreshToken,
    );

    if (!refreshTokenId) {
      throw new UnauthorizedException();
    }

    if (payload.exp < Date.now() / 1000) {
      await this.authService.logout(refreshTokenId);
      throw new UnauthorizedException();
    }

    return { userId: payload.userId, refreshTokenId };
  }
}
