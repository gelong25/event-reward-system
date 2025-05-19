import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 기반 인증 처리
 * Authorization 헤더의 Bearer 토큰을 검증함
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
