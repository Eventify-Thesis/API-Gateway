import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreatePaymentIntentDto {
    @ApiProperty()
    @IsNumber()
    orderId: number;
}