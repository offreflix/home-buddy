import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { googleConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private authService: AuthService) {
    super({
      clientID: googleConstants.clientID,
      clientSecret: googleConstants.clientSecret,
      callbackURL: googleConstants.callbackURL,
      scope: ['email', 'profile'],
    });

    this.logger.log(
      `Google Strategy initialized with callbackURL: ${googleConstants.callbackURL}`,
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      this.logger.log('Google profile received');
      const { name, emails, photos } = profile;

      if (!emails || emails.length === 0) {
        this.logger.error('No email found in Google profile');
        return done(new Error('No email found in Google profile'), null);
      }

      const userData = {
        email: emails[0].value,
        username: emails[0].value.split('@')[0],
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        picture: photos && photos.length > 0 ? photos[0].value : null,
        googleId: profile.id,
      };

      this.logger.log('Processing Google user');

      const user = await this.authService.validateOrCreateGoogleUser(userData);
      this.logger.log('Google user processed');

      done(null, user);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error(
        `Error validating Google user: ${err.message}`,
        err.stack,
      );
      done(err, null);
    }
  }
}
