import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from './reward-request.schema';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { EventService } from '../event/event.service';
import { RewardService } from '../reward/reward.service';

/**
 * 보상 요청 처리 비즈니스 로직 처리 서비스
 */
@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
  ) {}
  
  /**
   * 보상 요청 생성
   * @param createRewardRequestDto 요청 데이터
   * @returns 생성된 보상 요청
   * @throws ConflictException, BadRequestException 유효성 실패 시 예외 발생
   * 
   * 여러 유효성 검사 후 요청을 등록함
   */
  async create(
    createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequest> {
    // 이벤트 존재 확인
    const event = await this.eventService.findOne(
      createRewardRequestDto.eventId.toString(),
    
    // 이벤트가 활성 상태인지 확인
    if (!event.isActive) {
      throw new ConflictException('이벤트가 활성화 상태가 아닙니다');
    }
    
    // 이벤트 기간 확인
    const now = new Date();
    if (event.startDate && event.startDate > now) {
      throw new ConflictException('이벤트가 아직 시작되지 않았습니다');
    }
    if (event.endDate && event.endDate < now) {
      throw new ConflictException('이벤트가 이미 종료되었습니다');
    }
    
    // 보상 존재 여부 확인
    const reward = await this.rewardService.findOne(createRewardRequestDto.rewardId.toString());
    
    // 보상과 이벤트가 일치하는지 확인
    if (!reward.eventId.equals(createRewardRequestDto.eventId)) {
      throw new BadRequestException('잘못된 보상 요청입니다');
    }
    
    // 레벨 조건 충족 여부 확인
    if (createRewardRequestDto.characterLevel < reward.requiredLevel) {
      throw new BadRequestException(`캐릭터 레벨(${createRewardRequestDto.characterLevel})이 요구 레벨(${reward.requiredLevel})보다 낮습니다`);
    }
    
    // 보상 중복 요청 여부 확인
    const existingRequest = await this.rewardRequestModel.findOne({
      userId: createRewardRequestDto.userId,
      characterId: createRewardRequestDto.characterId,
      eventId: createRewardRequestDto.eventId,
      rewardId: createRewardRequestDto.rewardId,
    }).exec();
    
    if (existingRequest) {
      throw new ConflictException('이미 해당 보상을 요청했습니다');
    }
    
    // 보상 요청 생성 및 저장
    const rewardRequest = new this.rewardRequestModel({
      ...createRewardRequestDto,
      requestedAt: new Date(),
      status: 'PENDING',
    });
    
    return rewardRequest.save();
  }

  /**
   * 전체 보상 요청 조회
   */
  async findAll(): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find().exec();
  }
  /**
   * 특정 사용자 ID로 요청 조회
   */
  async findByUserId(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ userId }).exec();
  }
  /**
   * 특정 이벤트 ID로 요청 조회
   */
  async findByEventId(eventId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ eventId: new Types.ObjectId(eventId) }).exec();
  }
  /**
   * 특정 캐릭터 ID로 요청 조회
   */  
  async findByCharacterId(characterId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ characterId }).exec();
  }
} 