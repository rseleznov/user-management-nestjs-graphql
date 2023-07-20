import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RefreshTokenInput } from 'src/auth/dto/refreshToken.input';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  signUp(@Body() signUpDto: Record<string, string>) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenInput: RefreshTokenInput) {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
