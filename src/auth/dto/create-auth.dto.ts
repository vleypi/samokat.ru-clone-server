import { IsPhoneNumber, MinLength, IsString, IsEmail,IsOptional } from "class-validator";

export class AuthDto {
    @IsPhoneNumber()
    phone: string

    @IsString()
    @IsOptional()
    name: string
}
