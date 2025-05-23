import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateInterestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  eventId: number;
}
