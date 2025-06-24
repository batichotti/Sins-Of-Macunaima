import { IsEmail, IsString, IsNumber, MinLength, IsOptional } from 'class-validator';

export class SignUpDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsNumber()
    @IsOptional()
    best_run: number = 0;
}

export class SignInDTO {
    email: string;
    password: string;
}