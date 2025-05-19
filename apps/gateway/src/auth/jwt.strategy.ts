import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../../../libs/common/src/roles/role.enum';

/**
 * JWT 페이로드 인터페이스
 * 디코딩된 JWT에서 추출되는 사용자 정보의 구조 정의
 */
interface JwtPayload {
  sub: string; // 사용자 ID
  username: string;
  role?: UserRole;
}

/**
 * JWT 토큰을 검증하고 사용자 정보 추출
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JWT 전략 설정
   * @param configService 환경 설정 서비스
   *
   * 환경 변수에서 비밀키를 로드하여 JWT 검증 전략 초기화
   */
  constructor(private configService: ConfigService) {
    const secretKey = configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  /**
   * 토큰 검증 후 호출되는 메서드
   * @param payload 디코딩된 JWT 페이로드
   * @returns 요청에 첨부될 사용자 정보
   *
   * 페이로드에서 사용자 정보를 반환하면 Passport가 request.user에 할당함
   */
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role || UserRole.USER,
    };
  }
}
