import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 페이로드 인터페이스
 * JWT 토큰에서 디코딩된 사용자 정보 정의
 */
export interface JwtPayload {
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JWT 인증 전략 설정
   *
   * - Authorization 헤더에서 Bearer 토큰을 추출해 인증
   * - JWT_SECRET 환경 변수가 설정돼 있어야 함
   * - 토큰 만료 검사 수행
   */
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * JWT 페이로드로부터 사용자 정보를 추출
   *
   * Passport가 JWT를 성공적으로 인증했을 때 호출되는 메서드
   * @UseGuards(JwtAuthGuard) 데코레이터가 적용된 라우트에서 request.user에 담길 데이터를 반환함
   */
  validate(payload: JwtPayload) {
    return {
      username: payload.username,
      role: payload.role,
    };
  }
}
