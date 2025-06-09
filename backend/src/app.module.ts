import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BestiaryModule } from './bestiary/bestiary.module';
import { AchievementsModule } from './achievements/achievements.module';
import { MatchModule } from './match/match.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [UserModule, BestiaryModule, AchievementsModule, MatchModule, RankingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
