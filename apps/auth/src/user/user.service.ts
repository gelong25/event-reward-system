import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

/**
 * 사용자 서비스
 * 사용자 계정 생성 및 조회 기능 제공
 */
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 새로운 사용자 생성
   * @param username - 사용자 아이디
   * @param password - 사용자 비밀번호
   * @throws ConflictException - 이미 존재하는 사용자명일 경우 예외 발생
   * @returns 생성된 사용자 객체
   *
   * 비밀번호는 bcrypt로 해시해서 저장
   */
  async create(username: string, password: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }

    // TODO: saltRounds 환경변수로 관리 고려
    const hashed = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      password: hashed,
    });

    return user.save();
  }

  /**
   * 사용자명으로 사용자 조회
   * @param username - 조회할 사용자명
   * @returns 사용자 객체 또는 null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
