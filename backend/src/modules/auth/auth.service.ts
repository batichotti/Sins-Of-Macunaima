import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO, SignUpDTO } from '../user/dtos/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignUpDTO) {
    const result = await this.userService.signup(dto);
    
    const payload = { 
      sub: result.user.id, 
      email: result.user.email,
      name: result.user.name 
    };
    
    return {
      user: result.user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signin(dto: SignInDTO) {
    try {
      const result = await this.userService.validateCredentials(dto);
      
      const payload = { 
        sub: result.id, 
        email: result.email,
        name: result.name 
      };
      
      return {
        user: result,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}