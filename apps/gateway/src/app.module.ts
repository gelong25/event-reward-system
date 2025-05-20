import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AppController } from './app.controller';
import { EventModule } from './event/event.module';

/**
 * 게이트웨이 애플리케이션의 루트 모듈
 * 환경 설정, JWT 인증, 전략 주입 등의 설정을 담당함
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '3600s' },
    }),
    EventModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
