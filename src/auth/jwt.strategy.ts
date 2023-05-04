import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.respository';
import { JwtPayload } from './jwt-payload.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      secretOrKey: 'topSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate = async (payload: JwtPayload): Promise<UserEntity> => {
    const { username } = payload;
    const user: UserEntity = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  };
}
