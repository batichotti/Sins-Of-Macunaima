import { Body, Injectable, Param } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/user';

@Injectable()
export class UserService { 
    async findAll(sort: 'asc' | 'desc' = 'desc') {
        return { message: 'All users', sort };
    }

    async findTopScorers() {
        return { message: 'Top Scorers' };
    }

    async findOne(@Param('id') id: string) {
        return { message: 'One user', id };
    }

    async create(input: any) {
        return { message: 'New user', input };
    }

    async signup(@Body() data : SignUpDTO) {
        console.log({ data });
        return data;
    }

    async signin(@Body() data : SignInDTO) {
        console.log({ data });
        return data;
    }
}
