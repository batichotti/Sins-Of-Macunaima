import { IsEmail, IsString, IsNumber, MinLength, IsOptional, IsStrongPassword, Min } from 'class-validator';

export class SignUpDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password: string;

    @IsNumber()
    @IsOptional()
    best_run?: number;
}

export class SignInDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateBestRunDTO {
    @IsNumber()
    @Min(0)
    best_run: number;
}