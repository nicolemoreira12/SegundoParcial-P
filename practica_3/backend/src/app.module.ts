import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { OrdenModule } from './orden/orden.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: process.env.DATABASE_PATH || './database.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Solo para desarrollo
            logging: true,
        }),
        ProductoModule,
        OrdenModule,
    ],
})
export class AppModule { }
