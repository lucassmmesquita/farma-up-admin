import { Module } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { FarmaciasController } from './farmacias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FarmaciasController],
  providers: [FarmaciasService],
  exports: [FarmaciasService],
})
export class FarmaciasModule {}
