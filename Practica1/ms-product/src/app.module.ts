import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './product/product.entity';
import { ProductConsumer } from './product/product.consumer';
import { ProductService } from './product/product.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'pguser',
      password: 'pgpass',
      database: 'product_db',
      entities: [Product],
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [AppController, ProductConsumer],
  providers: [AppService, ProductService],
})
export class AppModule {}
