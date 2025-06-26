import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO } from './dtos/user';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc') {
        return this.userService.findAll(sort);
    }
    
    @Get('top')
    async findTopScorers() {
        return this.userService.findTopScorers();
    }
    
    @Get(':name') // URL parameter
    async findOneByName(@Param('name') name: string){
        return this.userService.findOneByName(name);
    }
    
    @Post()
    async create(@Body() body: SignUpDTO) {
        return this.userService.signup(body);
    }
}
