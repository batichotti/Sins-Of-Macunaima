import { Injectable, Param } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService { 
    constructor(private prismaService: PrismaService){}

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

    async signup(data : SignUpDTO) {
        const userAlreadyExists = await this.prismaService.user.findUnique({
            where: {
                email: data.email,
            },
        });
        console.log({ data });
        return data;
    }

    async signin(data : SignInDTO) {
        console.log({ data });
        return data;
    }
}