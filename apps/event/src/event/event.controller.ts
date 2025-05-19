import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.schema';

/**
 * 이벤트 관련 요청을 처리하는 컨트롤러
 */
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 이벤트 생성
   * @param createEventDto 생성할 이벤트 데이터
   * @returns 생성된 이벤트 객체
   */
  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }
  /**
   * 이벤트 전체 조회 또는 활성 이벤트만 조회
   * @param active 쿼리 파라미터 (active=true인 경우 활성 이벤트만 조회)
   * @returns 이벤트 목록
   */
  @Get()
  async findAll(@Query('active') active?: string): Promise<Event[]> {
    if (active === 'true') {
      return this.eventService.findActive();
    }
    return this.eventService.findAll();
  }
  /**
   * 이벤트 ID로 단일 조회
   * @param id 이벤트 ID
   * @returns 해당 ID의 이벤트
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }
}
