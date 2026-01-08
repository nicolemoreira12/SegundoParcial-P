import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto, UpdateOrdenDto } from './orden.dto';

@Controller('ordenes')
export class OrdenController {
    constructor(private readonly ordenService: OrdenService) { }

    @Get()
    async findAll() {
        return this.ordenService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ordenService.findOne(id);
    }

    @Post()
    async create(@Body() createOrdenDto: CreateOrdenDto) {
        return this.ordenService.create(createOrdenDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateOrdenDto: UpdateOrdenDto,
    ) {
        return this.ordenService.update(id, updateOrdenDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.ordenService.remove(id);
        return { message: 'Orden eliminada correctamente' };
    }
}
