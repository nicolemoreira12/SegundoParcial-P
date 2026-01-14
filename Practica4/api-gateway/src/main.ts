import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS
    app.enableCors();

    // Habilitar validación global
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🌐 API Gateway corriendo en http://localhost:${port}`);
    console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configurado ✓' : 'NO CONFIGURADO ✗'}`);
    console.log(`🔧 MCP Server: ${process.env.MCP_SERVER_URL}`);
    console.log(`\n💡 Prueba el endpoint: POST http://localhost:${port}/chat`);
}

bootstrap();
