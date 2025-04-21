"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmaciasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let FarmaciasService = class FarmaciasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFarmaciaDto) {
        const { usuariosAssociados, ...farmaciaData } = createFarmaciaDto;
        try {
            const existingFarmacia = await this.prisma.farmacia.findUnique({
                where: { cnpj: farmaciaData.cnpj },
            });
            if (existingFarmacia) {
                throw new common_1.ConflictException('Já existe uma farmácia com este CNPJ');
            }
            return await this.prisma.$transaction(async (prisma) => {
                const farmacia = await prisma.farmacia.create({
                    data: farmaciaData,
                });
                if (usuariosAssociados && usuariosAssociados.length > 0) {
                    await Promise.all(usuariosAssociados.map((usuarioId) => prisma.farmaciaUsuario.create({
                        data: {
                            farmaciaId: farmacia.id,
                            usuarioId,
                        },
                    })));
                }
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
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Já existe uma farmácia com este CNPJ');
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
        return farmacias.map(farmacia => {
            const { usuariosAssociados, ...rest } = farmacia;
            return {
                ...rest,
                totalUsuarios: usuariosAssociados.length,
            };
        });
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Farmácia com ID ${id} não encontrada`);
        }
        return farmacia;
    }
    async update(id, updateFarmaciaDto) {
        const { usuariosAssociados, ...farmaciaData } = updateFarmaciaDto;
        try {
            const existingFarmacia = await this.prisma.farmacia.findUnique({
                where: { id },
            });
            if (!existingFarmacia) {
                throw new common_1.NotFoundException(`Farmácia com ID ${id} não encontrada`);
            }
            return await this.prisma.$transaction(async (prisma) => {
                const farmacia = await prisma.farmacia.update({
                    where: { id },
                    data: farmaciaData,
                });
                if (usuariosAssociados !== undefined) {
                    await prisma.farmaciaUsuario.deleteMany({
                        where: { farmaciaId: id },
                    });
                    if (usuariosAssociados.length > 0) {
                        await Promise.all(usuariosAssociados.map((usuarioId) => prisma.farmaciaUsuario.create({
                            data: {
                                farmaciaId: id,
                                usuarioId,
                            },
                        })));
                    }
                }
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
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Já existe uma farmácia com este CNPJ');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            const existingFarmacia = await this.prisma.farmacia.findUnique({
                where: { id },
            });
            if (!existingFarmacia) {
                throw new common_1.NotFoundException(`Farmácia com ID ${id} não encontrada`);
            }
            await this.prisma.farmacia.delete({
                where: { id },
            });
            return { message: 'Farmácia removida com sucesso' };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Farmácia com ID ${id} não encontrada`);
                }
            }
            throw error;
        }
    }
};
exports.FarmaciasService = FarmaciasService;
exports.FarmaciasService = FarmaciasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FarmaciasService);
//# sourceMappingURL=farmacias.service.js.map