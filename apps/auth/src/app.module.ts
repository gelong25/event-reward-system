import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

/**
 * 애플리케이션 루트 모듈
 * 환경 설정, 데이터베이스 연결, 핵심 모듈 등록 담당
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      /**
       * 환경 변수 유효성 검증 스키마
       *
       * 환경 변수
       * - MONGO_URI: MongoDB 연결 문자열 (필수)
       * - JWT_SECRET: JWT 토큰 서명에 사용되는 비밀키 (필수)
       * - JWT_EXPIRES_IN: JWT 토큰 만료 시간 (기본값: 3600s)
       */
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('3600s'),
      }),
    }),
    /**
     * MongoDB 연결 설정
     * 환경 변수에서 MONGO_URI를 가져와 데이터베이스에 연결
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
