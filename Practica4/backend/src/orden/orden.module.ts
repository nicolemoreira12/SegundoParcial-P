import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './orden.entity';
import { OrdenController } from './orden.controller';
import { OrdenService } from './orden.service';
import { ProductoModule } from '../producto/producto.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Orden]),
        ProductoModule,
    ],
    controllers: [OrdenController],
    providers: [OrdenService],
    exports: [OrdenService],
})
export class OrdenModule { }
