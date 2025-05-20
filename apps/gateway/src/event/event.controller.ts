import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../../../libs/common/src/roles/role.enum';
import { Request } from 'express';

interface UserRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: UserRole;
  };
}

/**
 * 이벤트/보상/보상요청을 통합적으로 처리하는 프록시 컨트롤러
 * JWT 인증 필수
 * 일부 엔드포인트는 role 기반 접근 제어 적용
 */
@Controller('proxy')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 모든 이벤트 조회
   */
  @Get('events')
  getEvents() {
    return this.eventService.getAllEvents();
  }

  /**
   * 이벤트 ID로 단일 이벤트 조회
   * @param id 이벤트 ID
   */
  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }
  /**
   * 이벤트 생성
   * @param eventData 이벤트 데이터
   * @roles OPERATOR, ADMIN
   */
  @Post('events')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  createEvent(@Body() eventData: any) {
    return this.eventService.createEvent(eventData);
  }

  /**
   * 보상 목록 조회 (이벤트별 필터 가능)
   * @param eventId 이벤트 ID (optional)
   */
  @Get('rewards')
  getRewards(@Query('eventId') eventId?: string) {
    if (eventId) {
      return this.eventService.getRewardsByEventId(eventId);
    }
    return this.eventService.getRewards();
  }
  /**
   * 보상 생성
   * @param rewardData 보상 데이터
   * @roles OPERATOR, ADMIN
   */
  @Post('rewards')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  createReward(@Body() rewardData: any) {
    return this.eventService.createReward(rewardData);
  }

  /**
   * 보상 요청 생성
   * @param requestData 이벤트 ID, 캐릭터 ID, 캐릭터 레벨
   * @param req 사용자 인증 정보
   */
  @Post('rewards/request')
  requestReward(
    @Body()
    requestData: {
      eventId: string;
      characterId: string;
      characterLevel: number;
    },
    @Req() req: UserRequest,
  ) {
    return this.eventService.requestReward(
      req.user.userId,
      requestData.eventId,
      requestData.characterId,
      requestData.characterLevel,
    );
  }
  /**
   * 보상 요청 조회
   * @param req 사용자 정보
   * @param userId 사용자 ID (optional)
   * @param eventId 이벤트 ID (optional)
   * @param characterId 캐릭터 ID (optional)
   *
   * 일반 사용자는 자신의 요청만 조회 가능
   * 관리자/운영자/감사자는 조건별 조회 가능
   */
  @Get('rewards/request')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  getRewardRequests(
    @Req() req: UserRequest,
    @Query('userId') userId?: string,
    @Query('eventId') eventId?: string,
    @Query('characterId') characterId?: string,
  ) {
    // 일반 사용자는 자신의 요청만 조회 가능
    if (req.user.role === UserRole.USER) {
      return this.eventService.getRewardRequests({ userId: req.user.userId });
    }

    // 관리자/운영자/감사자는 필터링 기준으로 조회 가능
    return this.eventService.getRewardRequests({
      userId,
      eventId,
      characterId,
    });
  }
}
