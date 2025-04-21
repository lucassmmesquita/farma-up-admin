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
exports.CreateFarmaciaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateFarmaciaDto {
}
exports.CreateFarmaciaDto = CreateFarmaciaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Farmácia Central' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12.345.678/0001-90' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Principal, 123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "endereco", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 3456-7890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'contato@farmaciacentral.com' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#2E7D32' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "corPrincipal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#FF5722' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "corSecundaria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'data:image/png;base64,iVBORw0KGgoA...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateFarmaciaDto.prototype, "ativo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['1', '2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateFarmaciaDto.prototype, "usuariosAssociados", void 0);
//# sourceMappingURL=create-farmacia.dto.js.map