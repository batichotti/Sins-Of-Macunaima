import { Injectable } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/user';

@Injectable()
export class UserService {
    constructor(private userService: UserService){}

    async findAll(sort: 'asc' | 'desc' = 'desc') {
        return { message: 'All users', sort };
    }

    async findTopScorers() {
        return { message: 'Top Scorers' };
    }

    async findOne(id: string) {
        return { message: 'One user', id };
    }

    async create(input: any) {
        return { message: 'New user', input };
    }

    async signup(data : SignUpDTO) {
        console.log({ data });
        return data;
    }

    async signin(data : SignInDTO) {
        console.log({ data });
        return data;
    }
}
