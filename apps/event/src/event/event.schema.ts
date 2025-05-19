import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  condition: string; // e.g. "character-level", "login-days"

  @Prop({ type: Object })
  levelRewards: Record<number, string>; // 레벨별 보상 아이템 (레벨: 아이템ID)

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
