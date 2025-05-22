import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TesteModule } from './teste/teste.module';
import { TesteModule } from './teste/teste.module';

@Module({
  imports: [TesteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
