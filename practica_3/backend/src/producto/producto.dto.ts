import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    nombreProducto: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNumber()
    @Min(0)
    precio: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsOptional()
    @IsString()
    imagenURL?: string;

    @IsOptional()
    @IsNumber()
    idCategoria?: number;
}

export class UpdateProductoDto {
    @IsOptional()
    @IsString()
    nombreProducto?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    precio?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsString()
    imagenURL?: string;

    @IsOptional()
    @IsNumber()
    idCategoria?: number;
}
