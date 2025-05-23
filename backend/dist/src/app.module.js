"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const farmacias_module_1 = require("./farmacias/farmacias.module");
const indicadores_module_1 = require("./indicadores/indicadores.module");
const planos_acao_module_1 = require("./planos-acao/planos-acao.module");
const evidencias_module_1 = require("./evidencias/evidencias.module");
const medicamentos_module_1 = require("./medicamentos/medicamentos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            farmacias_module_1.FarmaciasModule,
            indicadores_module_1.IndicadoresModule,
            planos_acao_module_1.PlanosAcaoModule,
            evidencias_module_1.EvidenciasModule,
            medicamentos_module_1.MedicamentosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map