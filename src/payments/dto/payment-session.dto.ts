/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

export class PaymentSessionDto {

    @IsString()
    orderId: string;

    //asi va a lucir mi paiment session
    @IsString()
    currency: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested( {each: true} )
    @Type( () => PaymentSessionItemDto )
    items: PaymentSessionItemDto[];
}


export class PaymentSessionItemDto {

    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;


    @IsNumber()
    @IsPositive()
    quantity: number;


}