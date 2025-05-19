import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { RewardRequest } from './reward-request.schema';

/**
 * 보상 요청 관련 API를 제공하는 컨트롤러
 */
@Controller('rewards/request')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}
  /**
   * 보상 요청 생성
   * @param createRewardRequestDto 요청 정보
   * @returns 생성된 보상 요청 객체
   */
  @Post()
  async create(
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequest> {
    return this.rewardRequestService.create(createRewardRequestDto);
  }
  /**
   * 보상 요청 목록 조회
   * @param userId 사용자 ID
   * @param eventId 이벤트 ID
   * @param characterId 캐릭터 ID
   * @returns 보상 요청 배열
   *
   * userId, eventId, characterId 중 하나가 있을 경우 해당 조건으로 필터링
   * 조건이 없을 경우 전체 조회
   */
  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('eventId') eventId?: string,
    @Query('characterId') characterId?: string,
  ): Promise<RewardRequest[]> {
    if (userId) {
      return this.rewardRequestService.findByUserId(userId);
    }

    if (eventId) {
      return this.rewardRequestService.findByEventId(eventId);
    }

    if (characterId) {
      return this.rewardRequestService.findByCharacterId(characterId);
    }

    return this.rewardRequestService.findAll();
  }
}
