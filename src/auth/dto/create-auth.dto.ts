import { IsPhoneNumber, MinLength, IsString, IsEmail } from "class-validator";

export class AuthDto {
    @IsPhoneNumber()
    phone: string

    @IsString()
    name: string
}
