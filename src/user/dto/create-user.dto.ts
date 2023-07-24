import { IsEmail, IsOptional, IsString, IsPhoneNumber } from "class-validator";

export class UserDto {
    @IsPhoneNumber()
    phone: string;

    @IsString()
    name: string

    @IsOptional()
    @IsString()
    password?: string
}
