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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, senha } = loginDto;
        const usuario = await this.prisma.usuario.findUnique({
            where: { email },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (!usuario.ativo) {
            throw new common_1.UnauthorizedException('Usuário inativo');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map