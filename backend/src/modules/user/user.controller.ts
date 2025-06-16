import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc') {
        return this.userService.findAll(sort);
    }
    
    @Get('top')
    findTopScorers() {
        return this.userService.findTopScorers();
    }
    
    @Get(':id') // URL parameter
    findOne(@Param() id: string){
        return this.userService.findOne(id);
    }
    
    @Post()
    create(@Body() input: any) {
        return this.userService.create(input);
    }
}
