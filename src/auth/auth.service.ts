import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }


  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
