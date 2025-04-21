"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashSenha = await bcrypt.hash('senha123', 10);
    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@farmaup.com' },
        update: {},
        create: {
            nome: 'Admin FarmaUP',
            email: 'admin@farmaup.com',
            senha: hashSenha,
            perfil: 'Administrador',
            ativo: true,
        },
    });
    const carlos = await prisma.usuario.upsert({
        where: { email: 'carlos.souza@farmaup.com' },
        update: {},
        create: {
            nome: 'Carlos Souza',
            email: 'carlos.souza@farmaup.com',
            senha: hashSenha,
            perfil: 'Gestor de Farmácia',
            ativo: true,
        },
    });
    const roberto = await prisma.usuario.upsert({
        where: { email: 'roberto.almeida@farmaup.com' },
        update: {},
        create: {
            nome: 'Roberto Almeida',
            email: 'roberto.almeida@farmaup.com',
            senha: hashSenha,
            perfil: 'Validador',
            ativo: true,
        },
    });
    const farmaciaCentral = await prisma.farmacia.upsert({
        where: { cnpj: '12.345.678/0001-90' },
        update: {},
        create: {
            nome: 'Farmácia Central',
            cnpj: '12.345.678/0001-90',
            endereco: 'Av. Principal, 123',
            telefone: '(11) 3456-7890',
            email: 'contato@farmaciacentral.com',
            corPrincipal: '#2E7D32',
            corSecundaria: '#FF5722',
            ativo: true,
        },
    });
    const farmaciaSaude = await prisma.farmacia.upsert({
        where: { cnpj: '23.456.789/0001-01' },
        update: {},
        create: {
            nome: 'Farmácia Saúde',
            cnpj: '23.456.789/0001-01',
            endereco: 'Rua Secundária, 456',
            telefone: '(11) 4567-8901',
            email: 'contato@farmaciasaude.com',
            corPrincipal: '#1565C0',
            corSecundaria: '#FFC107',
            ativo: true,
        },
    });
    await prisma.farmaciaUsuario.createMany({
        data: [
            {
                farmaciaId: farmaciaCentral.id,
                usuarioId: admin.id,
            },
            {
                farmaciaId: farmaciaCentral.id,
                usuarioId: carlos.id,
            },
            {
                farmaciaId: farmaciaSaude.id,
                usuarioId: roberto.id,
            },
        ],
        skipDuplicates: true,
    });
    console.log('Seed executada com sucesso!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map