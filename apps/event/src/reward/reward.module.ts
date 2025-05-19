import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { Reward, RewardSchema } from './reward.schema';
import { EventModule } from '../event/event.module';

/**
 * 보상(Reward) 도메인 모듈
 * 보상 관련 컨트롤러, 서비스, Mongoose 스키마 구성
 * 이벤트 모듈에 의존
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    EventModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
