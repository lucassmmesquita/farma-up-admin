import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FarmaciasModule } from './farmacias/farmacias.module';
import { IndicadoresModule } from './indicadores/indicadores.module';
import { PlanosAcaoModule } from './planos-acao/planos-acao.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { MedicamentosModule } from './medicamentos/medicamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    FarmaciasModule,
    IndicadoresModule,
    PlanosAcaoModule,
    EvidenciasModule,
    MedicamentosModule,
  ],
})
export class AppModule {}
