import { Module } from '@nestjs/common';
import { MatchModule } from '../match/match.module';
import { BestiaryModule } from '../bestiary/bestiary.module';
import { RankingModule } from '../ranking/ranking.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MatchModule, BestiaryModule, RankingModule, AchievementsModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
