import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FarmaciasService } from './farmacias.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Farmácias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('farmacias')
export class FarmaciasController {
  constructor(private readonly farmaciasService: FarmaciasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova farmácia' })
  @ApiResponse({ status: 201, description: 'Farmácia criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Já existe uma farmácia com este CNPJ' })
  create(@Body() createFarmaciaDto: CreateFarmaciaDto) {
    return this.farmaciasService.create(createFarmaciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as farmácias' })
  @ApiResponse({ status: 200, description: 'Lista de farmácias' })
  findAll() {
    return this.farmaciasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma farmácia pelo ID' })
  @ApiResponse({ status: 200, description: 'Farmácia encontrada' })
  @ApiResponse({ status: 404, description: 'Farmácia não encontrada' })
  findOne(@Param('id') id: string) {
    return this.farmaciasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma farmácia pelo ID' })
  @ApiResponse({ status: 200, description: 'Farmácia atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Farmácia não encontrada' })
  @ApiResponse({ status: 409, description: 'Já existe uma farmácia com este CNPJ' })
  update(@Param('id') id: string, @Body() updateFarmaciaDto: UpdateFarmaciaDto) {
    return this.farmaciasService.update(id, updateFarmaciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma farmácia pelo ID' })
  @ApiResponse({ status: 200, description: 'Farmácia removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Farmácia não encontrada' })
  remove(@Param('id') id: string) {
    return this.farmaciasService.remove(id);
  }
}
