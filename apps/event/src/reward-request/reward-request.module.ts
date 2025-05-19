import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequestController } from './reward-request.controller';
import { RewardRequestService } from './reward-request.service';
import { RewardRequest, RewardRequestSchema } from './reward-request.schema';
import { EventModule } from '../event/event.module';
import { RewardModule } from '../reward/reward.module';

/**
 * 보상 요청 도메인 모듈
 * 보상 요청 스키마, 서비스, 컨트롤러 구성
 * 이벤트 및 보상 모듈에 의존
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EventModule,
    RewardModule,
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
})
export class RewardRequestModule {}
