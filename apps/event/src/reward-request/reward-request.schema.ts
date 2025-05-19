import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema()
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  characterId: string;

  @Prop({ required: true })
  characterLevel: number;

  @Prop({ required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  rewardId: Types.ObjectId;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Prop()
  requestedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
