import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { OrdenModule } from './orden/orden.module';
import { WebhookEmitterModule } from './common/webhook-emitter.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Solo para desarrollo
            logging: true,
        }),
        WebhookEmitterModule,
        ProductoModule,
        OrdenModule,
    ],
})
export class AppModule { }
