import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from './event.schema';

/**
 * 이벤트 도메인 모듈
 * 컨트롤러, 서비스, Mongoose 스키마를 묶어서 관리
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
