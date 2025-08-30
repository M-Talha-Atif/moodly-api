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
import { UserRole } from 'src/common/enums/user.enums';

/**
 * DTO for user privacy settings at sign-up.
 *
 * Allows users to configure how much data they share,
 * visibility in the community, and tracking consent.
 */
class PrivacySettingsDto {
  /**
   * Defines how much data can be shared with the platform.
   * Options: "minimal", "balanced", "full".
   */
  @IsOptional()
  @IsEnum(['minimal', 'balanced', 'full'])
  dataSharingLevel?: 'minimal' | 'balanced' | 'full';

  /**
   * Defines community profile visibility.
   * Options: "private", "connections", "public".
   */
  @IsOptional()
  @IsEnum(['private', 'connections', 'public'])
  communityVisibility?: 'private' | 'connections' | 'public';

  /**
   * Indicates whether the user consents to activity tracking.
   */
  @IsOptional()
  trackingConsent?: boolean;
}

/**
 * DTO for handling user sign-up requests.
 *
 * Validates and transforms incoming data when a new user registers.
 */
export class SignUpDto {
  /**
   * The user's email address.
   * Must be in valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * The user's account password.
   * Must be between 8 and 64 characters.
   */
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  /**
   * The user's display name.
   * Optional field.
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * URL of the user's avatar/profile picture.
   * Optional field.
   */
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  /**
   * User’s cultural background information.
   * May include ethnicity, religion, and personal values.
   */
  @IsOptional()
  culturalBackground?: {
    ethnicity?: string;
    religion?: string;
    values?: string[];
  };

  /**
   * Languages the user prefers for communication.
   */
  @IsArray()
  @IsOptional()
  languagePreferences?: string[];

  /**
   * Preferred communication style (e.g., formal, casual).
   */
  @IsString()
  @IsOptional()
  communicationStyle?: string;

  /**
   * User-defined privacy settings.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  /**
   * User role within the system.
   * Defaults are usually handled by the service layer.
   */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
