import { IsEmail, IsString, IsNumber, MinLength } from 'class-validator';

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
    best_run: number;
}


export class SignInDTO {
    email: string;
    password: string;
    best_run: number;
}