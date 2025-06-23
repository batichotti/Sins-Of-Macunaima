export interface SignUpDTO {
    name: string;
    email: string;
    password: string;
    best_run: number;
}

export interface SignInDTO {
    email: string;
    password: string;
    best_run: number;
}