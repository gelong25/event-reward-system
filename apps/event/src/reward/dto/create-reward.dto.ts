import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsMongoId()
  eventId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsNotEmpty()
  @IsNumber()
  requiredLevel: number;
}
