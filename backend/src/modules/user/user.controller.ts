import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDTO, SignUpDTO } from './dtos/user';

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
    
    @Get(':id') // URL parameter
    async findOne(@Param('id') id: string){
        return this.userService.findOne(id);
    }
    
    @Post('signup')
    async signup(@Body() body: SignUpDTO) {
        console.log({ body });
        return body;
    }
    
    @Post('signin')
    async signin(@Body() body: SignInDTO) {
        console.log({ body });
        return body;
    }
}
