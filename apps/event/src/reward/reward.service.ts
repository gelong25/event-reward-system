import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from './reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { EventService } from '../event/event.service';

/**
 * 보상 관련 비즈니스 로직 처리 서비스
 */
@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    private readonly eventService: EventService,
  ) {}
  /**
   * 보상 생성
   * 이벤트 존재 여부를 확인한 뒤 보상 생성
   * @param createRewardDto 보상 생성 정보
   * @returns 생성된 보상 객체
   */
  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    // 이벤트 존재 여부 확인
    await this.eventService.findOne(createRewardDto.eventId.toString());

    const createdReward = new this.rewardModel(createRewardDto);
    return createdReward.save();
  }
  /**
   * 전체 보상 목록 조회
   * @returns 보상 객체 배열
   */
  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }
  /**
   * 보상 단건 조회
   * @param id 보상 ID
   * @returns 보상 객체
   * @throws NotFoundException 보상이 존재하지 않는 경우
   */
  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).exec();
    if (!reward) {
      throw new NotFoundException(`보상 ID ${id}를 찾을 수 없습니다`);
    }
    return reward;
  }
  /**
   * 이벤트 ID 기준 보상 목록 조회
   * @param eventId 이벤트 ID
   * @returns 해당 이벤트의 보상 배열
   */
  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .exec();
  }
  /**
   * 보상 레벨 조건으로 조회
   * 해당 이벤트의 보상 중 특정 레벨 이하 조건을 만족하는 보상만 반환
   * @param eventId 이벤트 ID
   * @param level 요청자의 현재 레벨
   * @returns 조건에 맞는 보상 배열
   */
  async findByLevel(eventId: string, level: number): Promise<Reward[]> {
    return this.rewardModel
      .find({
        eventId: new Types.ObjectId(eventId),
        requiredLevel: { $lte: level },
      })
      .exec();
  }
}
