import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward } from './reward.schema';

/**
 * 보상 관련 API를 제공하는 컨트롤러
 */
@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  /**
   * 보상 생성
   * @param createRewardDto 생성할 보상 정보
   * @returns 생성된 보상 객체
   */
  @Post()
  async create(@Body() createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardService.create(createRewardDto);
  }
  /**
   * 보상 목록 조회
   * eventId 또는 level이 있을 경우 조건에 따라 필터링
   * @param eventId 이벤트 ID
   * @param level 보상 레벨
   * @returns 보상 객체 배열
   */
  @Get()
  async findAll(
    @Query('eventId') eventId?: string,
    @Query('level') level?: number,
  ): Promise<Reward[]> {
    if (eventId && level) {
      return this.rewardService.findByLevel(eventId, level);
    }

    if (eventId) {
      return this.rewardService.findByEventId(eventId);
    }

    return this.rewardService.findAll();
  }
  /**
   * 보상 단건 조회
   * @param id 보상 ID
   * @returns 해당 보상 객체
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Reward> {
    return this.rewardService.findOne(id);
  }
}
