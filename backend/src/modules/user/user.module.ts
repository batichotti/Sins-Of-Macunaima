import { Module } from '@nestjs/common';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { MatchModule } from 'src/match/match.module';
import { BestiaryModule } from 'src/bestiary/bestiary.module';
import { RankingModule } from 'src/ranking/ranking.module';
import { UserController } from './user.controller';

@Module({
    imports: [MatchModule, BestiaryModule, RankingModule, AchievementsModule],
    controllers: [UserController]
})
export class UserModule {}
