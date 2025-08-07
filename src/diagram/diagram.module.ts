// diagram.module.ts
import { Module } from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { DiagramController } from './diagram.controller';

@Module({
  providers: [DiagramService],
  exports: [DiagramService],
  controllers: [DiagramController],
})
export class DiagramModule {}
