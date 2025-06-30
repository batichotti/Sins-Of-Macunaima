import { Body, Controller, Get, Param, Post, Patch, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO, UpdateBestRunDTO } from './dtos/user';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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

    // @UseGuards(JwtAuthGuard)
    @Patch(':id/best-run')
    async updateBestRun(
        @Param('id') id: string,
        @Body() body: UpdateBestRunDTO,
        @Request() req: any,
    ) {
        const userId = parseInt(id);
        
        if (isNaN(userId) || userId <= 0) {
            throw new ForbiddenException('Invalid user ID');
        }
        
        // Verifica se o usuário logado está tentando atualizar sua própria run
        if (req.user.sub !== userId) {
            throw new ForbiddenException('You can only update your own best run');
        }
        
        return this.userService.updateBestRun(userId, body.best_run);
    }
}
