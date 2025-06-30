import { BadRequestException, Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/user';
import { PrismaService } from '../prisma/prisma.service';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async findAll(sort: 'asc' | 'desc' = 'desc') {
        return this.prismaService.user.findMany({
            orderBy: {
                id_user: sort,
            },
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });
    }

    async findTopScorers(limit: number = 10) {
        return this.prismaService.user.findMany({
            orderBy: {
                best_run: 'desc',
            },
            take: limit,
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });
    }

    async findOne(@Param('id') id: number) {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }
        const user = await this.prismaService.user.findUnique({
            where: { id_user: id },
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async findOneByName(@Param('name') name: string) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new BadRequestException('Invalid user name');
        }
        const user = await this.prismaService.user.findUnique({
            where: { name },
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async signup(data: SignUpDTO) {
        const userAlreadyExists = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { name: data.name },
                ],
            },
        });

        if (userAlreadyExists) {
            throw new BadRequestException('Nickname or email is already in use');
        }

        const hashedPassword = await HashUtil.hash(data.password);

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        return {
            user: {
                id: user.id_user,
                name: user.name,
                email: user.email,
            },
        };
    }

    async validateCredentials(data: SignInDTO) {
        const user = await this.prismaService.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            await HashUtil.compare('dummy', '$2b$12$dummyhash'); // Avoiding timing attacks
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await HashUtil.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            id: user.id_user,
            name: user.name,
            email: user.email,
        };
    }

    async updateBestRun(userId: number, newBestRun: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id_user: userId },
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (newBestRun <= (user.best_run || 0)) {
            return {
                message: 'Best run not updated - current run is not better than existing best run',
                user: user,
                updated: false,
            };
        }

        const updatedUser = await this.prismaService.user.update({
            where: { id_user: userId },
            data: { best_run: newBestRun },
            select: {
                id_user: true,
                name: true,
                email: true,
                best_run: true,
            },
        });

        return {
            message: 'Best run updated successfully',
            user: updatedUser,
            updated: true,
        };
    }
}