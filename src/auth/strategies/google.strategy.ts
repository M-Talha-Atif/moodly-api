// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

/**
 * GoogleStrategy
 *
 * Handles Google OAuth2 login via Passport.
 * - Ensures environment variables are set at runtime.
 * - Creates or fetches user via AuthService.
 * - Issues JWT token to frontend.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
      process.env;

    // Runtime check to ensure required environment variables exist
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
      throw new Error('Google OAuth environment variables are missing!');
    }

    // Initialize Passport Google strategy
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true, // allows req to be accessed in validate()
    });
  }

  /**
   * validate()
   *
   * Called by Passport after Google OAuth is successful.
   * - Extracts user info from Google profile
   * - Creates or fetches the user from database
   * - Returns user object which Passport attaches to req.user
   *
   * @param req - Express request object
   * @param accessToken - Google access token
   * @param refreshToken - Google refresh token
   * @param profile - Google profile object
   * @param done - Passport callback
   */
  async validate(
    req: Express.Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { emails, displayName, photos } = profile;

      // Ensure email exists
      if (!emails || !emails.length) {
        return done(new Error('No email found in Google profile'), false);
      }

      const user = await this.authService.validateGoogleLogin({
        email: emails[0].value,
        name: displayName || undefined,
        avatarUrl: photos?.[0]?.value || undefined,
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
