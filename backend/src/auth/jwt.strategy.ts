import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, nome: true, perfil: true, ativo: true },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedException();
    }

    return { 
      id: user.id, 
      email: user.email, 
      nome: user.nome, 
      perfil: user.perfil 
    };
  }
}