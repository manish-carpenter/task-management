import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.respository';
import { AuthCredentialsDto } from './auth.credential';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signUp = async (authCredentialDto: AuthCredentialsDto): Promise<void> => {
    return this.usersRepository.createUser(authCredentialDto);
  };

  signIn = async (
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> => {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  };
}
