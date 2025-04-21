import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateFarmaciaDto {
  @ApiProperty({ example: 'Farmácia Central' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiPropertyOptional({ example: 'Av. Principal, 123' })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiPropertyOptional({ example: '(11) 3456-7890' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ example: 'contato@farmaciacentral.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '#2E7D32' })
  @IsString()
  @IsOptional()
  corPrincipal?: string;

  @ApiPropertyOptional({ example: '#FF5722' })
  @IsString()
  @IsOptional()
  corSecundaria?: string;

  @ApiPropertyOptional({ example: 'data:image/png;base64,iVBORw0KGgoA...' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiPropertyOptional({ example: ['1', '2'] })
  @IsArray()
  @IsOptional()
  usuariosAssociados?: string[];
}