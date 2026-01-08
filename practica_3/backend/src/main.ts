import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para permitir llamadas desde otros servicios
    app.enableCors();

    // Habilitar validación global
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const port = process.env.PORT || 3002;
    await app.listen(port);

    console.log(`🚀 Backend corriendo en http://localhost:${port}`);
    console.log(`📊 Base de datos SQLite: ${process.env.DATABASE_PATH || './database.sqlite'}`);
}

bootstrap();
