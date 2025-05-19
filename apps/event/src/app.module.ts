import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { RewardModule } from './reward/reward.module';
import { RewardRequestModule } from './reward-request/reward-request.module';

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI 환경변수가 설정되지 않았습니다.');
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(mongoUri),
    EventModule,
    RewardModule,
    RewardRequestModule,
  ],
})
export class AppModule {}
