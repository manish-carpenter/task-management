import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './auth.credential';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  singIn(
    @Body() authCredentialDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }
}
