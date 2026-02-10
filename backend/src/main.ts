import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dns from 'dns';

// 🚀 FORCE IPV4: This fixes the "ENETUNREACH" email error
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS: Allow your Vercel frontend to talk to this backend
  app.enableCors({
    origin: '*', // Allows all domains (easiest for now)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🚨 CRITICAL FIX: Use the port Render gives you, or 3000 locally
  await app.listen(process.env.PORT || 3000); 
}
bootstrap();