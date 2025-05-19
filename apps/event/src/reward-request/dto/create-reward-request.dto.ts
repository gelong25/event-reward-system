import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRewardRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  characterId: string;

  @IsNotEmpty()
  @IsNumber()
  characterLevel: number;

  @IsNotEmpty()
  @IsMongoId()
  eventId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  rewardId: Types.ObjectId;
}
