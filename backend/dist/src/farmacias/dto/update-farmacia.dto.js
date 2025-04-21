"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFarmaciaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_farmacia_dto_1 = require("./create-farmacia.dto");
class UpdateFarmaciaDto extends (0, swagger_1.PartialType)(create_farmacia_dto_1.CreateFarmaciaDto) {
}
exports.UpdateFarmaciaDto = UpdateFarmaciaDto;
//# sourceMappingURL=update-farmacia.dto.js.map