import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;
    
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const payload = { 
      sub: usuario.id, 
      email: usuario.email, 
      nome: usuario.nome, 
      perfil: usuario.perfil 
    };
    
    return {
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      token: this.jwtService.sign(payload),
    };
  }
}