import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmotionModule } from './emotion/emotion.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    EmotionModule,
    ExperienceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
