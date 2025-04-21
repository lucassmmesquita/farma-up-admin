import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';
export declare class FarmaciasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFarmaciaDto: CreateFarmaciaDto): Promise<{
        usuariosAssociados: ({
            usuario: {
                id: string;
                nome: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmaciaId: string;
            usuarioId: string;
        })[];
    } & {
        id: string;
        nome: string;
        email: string | null;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        endereco: string | null;
        telefone: string | null;
        corPrincipal: string;
        corSecundaria: string;
        logo: string | null;
    }>;
    findAll(): Promise<{
        totalUsuarios: number;
        id: string;
        nome: string;
        email: string | null;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        endereco: string | null;
        telefone: string | null;
        corPrincipal: string;
        corSecundaria: string;
        logo: string | null;
    }[]>;
    findOne(id: string): Promise<{
        usuariosAssociados: ({
            usuario: {
                id: string;
                nome: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmaciaId: string;
            usuarioId: string;
        })[];
    } & {
        id: string;
        nome: string;
        email: string | null;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        endereco: string | null;
        telefone: string | null;
        corPrincipal: string;
        corSecundaria: string;
        logo: string | null;
    }>;
    update(id: string, updateFarmaciaDto: UpdateFarmaciaDto): Promise<{
        usuariosAssociados: ({
            usuario: {
                id: string;
                nome: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmaciaId: string;
            usuarioId: string;
        })[];
    } & {
        id: string;
        nome: string;
        email: string | null;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        endereco: string | null;
        telefone: string | null;
        corPrincipal: string;
        corSecundaria: string;
        logo: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
