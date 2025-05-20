import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventService } from './event.service';
import { EventController } from './event.controller';

/**
 * 이벤트 처리 모듈
 * 이벤트 관련 API 컨트롤러 및 서비스 등록
 * 외부 HTTP 통신을 위한 HttpModule 포함
 */
@Module({
  imports: [HttpModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
