import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthRepository } from '../interfaces/auth.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly repo: IAuthRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.repo.findUserByEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const comparedPassword=await bcrypt.compare(password, user.password)
    console.log({hashedPassword,comparedPassword});
    if (!user || !comparedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id_user,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id_user,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}
