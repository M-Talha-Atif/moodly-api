import { PartialType } from '@nestjs/mapped-types';
import { CreateEmotionDto } from './create-emotion.dto';

export class UpdateEmotionDto extends PartialType(CreateEmotionDto) {}
