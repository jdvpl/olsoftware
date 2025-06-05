import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './application/dto/login.dto';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { Public } from '../shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUC: LoginUseCase) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUC.execute(dto.email, dto.password);
  }
}
