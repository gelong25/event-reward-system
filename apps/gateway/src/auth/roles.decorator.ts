import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../../libs/common/src/roles/role.enum';

/**
 * 접근 가능한 역할을 지정하는 데코레이터
 * @param roles 접근 가능한 역할 목록
 * @returns 역할 정보를 메타데이터에 등록하는 데코레이터
 *
 * 컨트롤러 또는 라우트 핸들러에 적용해서
 * 지정된 역할을 가진 사용자만 해당 엔드포인트에 접근할 수 있도록 설정함
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
