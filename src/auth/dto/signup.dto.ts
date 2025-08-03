import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/users/entities/user.entity';

class PrivacySettingsDto {
  @IsOptional()
  @IsEnum(['minimal', 'balanced', 'full'])
  dataSharingLevel?: 'minimal' | 'balanced' | 'full';

  @IsOptional()
  @IsEnum(['private', 'connections', 'public'])
  communityVisibility?: 'private' | 'connections' | 'public';

  @IsOptional()
  trackingConsent?: boolean;
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  culturalBackground?: {
    ethnicity?: string;
    religion?: string;
    values?: string[];
  };

  @IsArray()
  @IsOptional()
  languagePreferences?: string[];

  @IsString()
  @IsOptional()
  communicationStyle?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
