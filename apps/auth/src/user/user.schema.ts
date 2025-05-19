import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * User Document 타입 정의
 */
export type UserDocument = User & Document;

/**
 * 사용자 권한 열거형
 * 시스템에서 사용되는 사용자 역할 정의
 */
export enum UserRole {
  /** 일반 사용자 */
  USER = 'USER',
  /** 운영자 */
  OPERATOR = 'OPERATOR',
  /** 감사자 */
  AUDITOR = 'AUDITOR',
  /** 관리자 */
  ADMIN = 'ADMIN',
}

/**
 * 사용자 스키마 클래스
 */
@Schema()
export class User {
  /** 사용자 아이디 (고유값) */
  @Prop({ required: true, unique: true })
  username: string;

  /** 암호화된 비밀번호 */
  @Prop({ required: true })
  password: string;

  /** 사용자 권한 (기본값: USER) */
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
