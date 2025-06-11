import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc') {
        return 'All users';
    }

    @Get('top')
    findTopScorers() {
        return 'Top Scorers';
    }

    @Get(':id') // URL parameter
    findOne(@Param() id: string){
        return 'One user';
    }

    @Post()
    create(@Body() input: any) {
        return 'New user';
    }
}
