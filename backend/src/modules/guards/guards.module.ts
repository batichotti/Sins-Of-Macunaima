import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class GuardsModule {}
