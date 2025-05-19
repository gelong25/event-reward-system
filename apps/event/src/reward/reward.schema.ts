import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  type: string; // e.g. 'item', 'potion', 'equipment'

  @Prop()
  itemId: string; // 아이템 식별자

  @Prop()
  itemName: string; // 아이템 이름

  @Prop()
  amount: number; // 아이템 수량

  @Prop({ type: Number })
  requiredLevel: number; // 보상을 받기 위한 필요 레벨
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
