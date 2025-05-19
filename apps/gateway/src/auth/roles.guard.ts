import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../../libs/common/src/roles/role.enum';
import { Request } from 'express';

/**
 * 사용자 역할을 기반으로 접근 권한을 검사하는 가드
 * 핸들러나 클래스에 지정된 역할 메타데이터를 기준으로 사용자의 접근 여부를 결정함
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 접근 권한을 검사하는 메서드
   * @param context 실행 컨텍스트
   * @returns 사용자의 접근 가능 여부 (true/false)
   *
   * 라우트 핸들러나 컨트롤러에 지정된 요구 역할과 요청 사용자의 역할을 비교함
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // 역할 제한이 없으면 접근 허용
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { role?: UserRole };

    // 사용자 정보 또는 역할이 없으면 접근 거부
    if (!user || !user.role) {
      return false;
    }

    // 사용자의 역할이 필요한 역할 중 하나와 일치하는지 확인
    return (
      Array.isArray(requiredRoles) &&
      requiredRoles.some((role) => role === user.role)
    );
  }
}
