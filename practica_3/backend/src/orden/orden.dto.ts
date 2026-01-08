import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrdenDto {
    @IsString()
    idProducto: string;

    @IsNumber()
    @Min(1)
    cantidad: number;

    @IsOptional()
    @IsString()
    nombreCliente?: string;

    @IsOptional()
    @IsString()
    emailCliente?: string;
}

export class UpdateOrdenDto {
    @IsOptional()
    @IsString()
    estado?: string;

    @IsOptional()
    @IsString()
    nombreCliente?: string;

    @IsOptional()
    @IsString()
    emailCliente?: string;
}
