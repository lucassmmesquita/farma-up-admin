// src/farmacias/farmacias.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FarmaciasService {
  constructor(private prisma: PrismaService) {}

  async create(createFarmaciaDto: CreateFarmaciaDto) {
    const { usuariosAssociados, ...farmaciaData } = createFarmaciaDto;

    try {
      // Verificar se já existe uma farmácia com o mesmo CNPJ
      const existingFarmacia = await this.prisma.farmacia.findUnique({
        where: { cnpj: farmaciaData.cnpj },
      });

      if (existingFarmacia) {
        throw new ConflictException('Já existe uma farmácia com este CNPJ');
      }

      // Criar farmácia e associações de usuários em uma transação
      return await this.prisma.$transaction(async (prisma) => {
        const farmacia = await prisma.farmacia.create({
          data: farmaciaData,
        });

        // Se houver usuários a serem associados
        if (usuariosAssociados && usuariosAssociados.length > 0) {
          // Criar associações de usuários
          await Promise.all(
            usuariosAssociados.map((usuarioId) =>
              prisma.farmaciaUsuario.create({
                data: {
                  farmaciaId: farmacia.id,
                  usuarioId,
                },
              }),
            ),
          );
        }

        // Recuperar a farmácia com usuários associados
        return await prisma.farmacia.findUnique({
          where: { id: farmacia.id },
          include: {
            usuariosAssociados: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe uma farmácia com este CNPJ');
        }
      }
      throw error;
    }
  }

  async findAll() {
    const farmacias = await this.prisma.farmacia.findMany({
      include: {
        usuariosAssociados: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Converter o formato de usuariosAssociados para totalUsuarios
    return farmacias.map(farmacia => {
      const { usuariosAssociados, ...rest } = farmacia;
      return {
        ...rest,
        totalUsuarios: usuariosAssociados.length,
      };
    });
  }

  async findOne(id: string) {
    const farmacia = await this.prisma.farmacia.findUnique({
      where: { id },
      include: {
        usuariosAssociados: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!farmacia) {
      throw new NotFoundException(`Farmácia com ID ${id} não encontrada`);
    }

    return farmacia;
  }

  async update(id: string, updateFarmaciaDto: UpdateFarmaciaDto) {
    const { usuariosAssociados, ...farmaciaData } = updateFarmaciaDto;

    try {
      // Verificar se a farmácia existe
      const existingFarmacia = await this.prisma.farmacia.findUnique({
        where: { id },
      });

      if (!existingFarmacia) {
        throw new NotFoundException(`Farmácia com ID ${id} não encontrada`);
      }

      // Atualizar farmácia e associações de usuários em uma transação
      return await this.prisma.$transaction(async (prisma) => {
        // Atualizar dados da farmácia
        const farmacia = await prisma.farmacia.update({
          where: { id },
          data: farmaciaData,
        });

        // Se usuariosAssociados foi fornecido, atualizar as associações
        if (usuariosAssociados !== undefined) {
          // Remover associações existentes
          await prisma.farmaciaUsuario.deleteMany({
            where: { farmaciaId: id },
          });

          // Adicionar novas associações
          if (usuariosAssociados.length > 0) {
            await Promise.all(
              usuariosAssociados.map((usuarioId) =>
                prisma.farmaciaUsuario.create({
                  data: {
                    farmaciaId: id,
                    usuarioId,
                  },
                }),
              ),
            );
          }
        }

        // Recuperar a farmácia atualizada com usuários associados
        return await prisma.farmacia.findUnique({
          where: { id },
          include: {
            usuariosAssociados: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe uma farmácia com este CNPJ');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Verificar se a farmácia existe
      const existingFarmacia = await this.prisma.farmacia.findUnique({
        where: { id },
      });

      if (!existingFarmacia) {
        throw new NotFoundException(`Farmácia com ID ${id} não encontrada`);
      }

      // Remover a farmácia e suas associações (em cascata conforme schema)
      await this.prisma.farmacia.delete({
        where: { id },
      });

      return { message: 'Farmácia removida com sucesso' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Farmácia com ID ${id} não encontrada`);
        }
      }
      throw error;
    }
  }
}