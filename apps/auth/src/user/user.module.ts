import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

/**
 * 사용자 모듈
 * 사용자 관련 기능과 MongoDB 스키마 정의
 */
@Module({
  imports: [
    /**
     * MongoDB 사용자 스키마 등록
     * User 엔티티와 UserSchema 연결
     */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
