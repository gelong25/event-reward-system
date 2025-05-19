import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 사용자 인증 검증
   * @param username - 사용자 아이디
   * @param password - 사용자 비밀번호
   * @throws UnauthorizedException - 사용자가 존재하지 않거나 비밀번호가 일치하지 않을 경우
   * @returns 인증된 사용자 정보
   *
   * bcrypt를 사용해 해시된 비밀번호와 평문 비밀번호 비교
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

    return user;
  }

  /**
   * JWT 토큰 생성 및 반환
   * @param user - 인증된 사용자 객체
   * @returns access_token이 포함된 객체
   *
   * payload에는 username과 role 포함: 사용자 권한 확인에 활용할 수 있음
   */
  login(user: User) {
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
