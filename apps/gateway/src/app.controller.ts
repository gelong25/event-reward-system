import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { UserRole } from '../../../libs/common/src/roles/role.enum';

// 인증된 사용자 정보를 포함하는 요청 타입
interface UserRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: UserRole;
  };
}

/**
 * 인증 및 역할 기반 보호가 적용된 컨트롤러
 * ADMIN 또는 OPERATOR role 사용자가 접근할 수 있는 엔드포인트 제공
 */
@Controller()
export class AppController {
  /**
   * ADMIN 및 OPERATOR role 사용자만 접근 가능한 엔드포인트
   * @param req 요청 객체 (인증된 사용자 정보 포함)
   * @returns 사용자 정보 및 접근 성공 메시지
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get('admin-only')
  adminAccess(@Req() req: UserRequest) {
    return {
      message: `접근에 성공했습니다.`,
      user: req.user,
    };
  }
}
