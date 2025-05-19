import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventDto } from './dto/create-event.dto';

/**
 * 이벤트 관련 비즈니스 로직 처리
 */
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  /**
   * 이벤트 생성
   * @param createEventDto 생성할 이벤트 데이터
   * @returns 생성된 이벤트 객체
   */  
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  /**
   * 모든 이벤트 조회
   * @returns 이벤트 배열
   */  
  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  /**
   * 특정 ID의 이벤트 조회
   * @param id 이벤트 ID
   * @returns 해당 이벤트 객체
   * @throws NotFoundException 이벤트가 존재하지 않을 경우 예외 발생
   */  
  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`이벤트 ID ${id}를 찾을 수 없습니다`);
    }
    return event;
  }

  /**
   * 현재 시점에 활성 상태인 이벤트 목록 조회
   * - isActive: true
   * - startDate가 없거나 현재보다 이전
   * - endDate가 없거나 현재보다 이후
   * @returns 활성 이벤트 배열
   */  
  async findActive(): Promise<Event[]> {
    const now = new Date();
    return this.eventModel.find({
        isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: now } }
          ]
        },
        {
            $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }],
          ]
        }
      ]
    }).exec();
  }
}