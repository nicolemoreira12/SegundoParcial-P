import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';

@Controller('productos')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) { }

    @Get()
    async findAll(@Query('nombre') nombre?: string) {
        if (nombre) {
            return this.productoService.searchByName(nombre);
        }
        return this.productoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productoService.findOne(id);
    }

    @Post()
    async create(@Body() createProductoDto: CreateProductoDto) {
        return this.productoService.create(createProductoDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductoDto: UpdateProductoDto,
    ) {
        return this.productoService.update(id, updateProductoDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.productoService.remove(id);
        return { message: 'Producto eliminado correctamente' };
    }
}
