import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * 인증 관련 모듈
 * 회원가입, 로그인, JWT 인증 전략 정의
 */
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      /**
       * JWT 설정
       * 환경 변수로부터 비밀키와 만료 시간을 주입받아 JWT를 구성
       *
       * 환경 변수
       * - JWT_SECRET: 토큰 서명에 사용할 비밀키 (필수)
       * - JWT_EXPIRES_IN: 토큰 만료 시간 (기본값: 3600s)
       */
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
