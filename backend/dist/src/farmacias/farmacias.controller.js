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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmaciasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const farmacias_service_1 = require("./farmacias.service");
const create_farmacia_dto_1 = require("./dto/create-farmacia.dto");
const update_farmacia_dto_1 = require("./dto/update-farmacia.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FarmaciasController = class FarmaciasController {
    constructor(farmaciasService) {
        this.farmaciasService = farmaciasService;
    }
    create(createFarmaciaDto) {
        return this.farmaciasService.create(createFarmaciaDto);
    }
    findAll() {
        return this.farmaciasService.findAll();
    }
    findOne(id) {
        return this.farmaciasService.findOne(id);
    }
    update(id, updateFarmaciaDto) {
        return this.farmaciasService.update(id, updateFarmaciaDto);
    }
    remove(id) {
        return this.farmaciasService.remove(id);
    }
};
exports.FarmaciasController = FarmaciasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova farmácia' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Farmácia criada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Já existe uma farmácia com este CNPJ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_farmacia_dto_1.CreateFarmaciaDto]),
    __metadata("design:returntype", void 0)
], FarmaciasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as farmácias' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de farmácias' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FarmaciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter uma farmácia pelo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Farmácia encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Farmácia não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FarmaciasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar uma farmácia pelo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Farmácia atualizada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Farmácia não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Já existe uma farmácia com este CNPJ' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_farmacia_dto_1.UpdateFarmaciaDto]),
    __metadata("design:returntype", void 0)
], FarmaciasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma farmácia pelo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Farmácia removida com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Farmácia não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FarmaciasController.prototype, "remove", null);
exports.FarmaciasController = FarmaciasController = __decorate([
    (0, swagger_1.ApiTags)('Farmácias'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('farmacias'),
    __metadata("design:paramtypes", [farmacias_service_1.FarmaciasService])
], FarmaciasController);
//# sourceMappingURL=farmacias.controller.js.map