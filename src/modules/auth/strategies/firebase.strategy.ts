import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as admin from 'firebase-admin';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  private readonly logger = new Logger(FirebaseStrategy.name);

  constructor(private usersService: UsersService) {
    super();
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      try {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log('Firebase initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase', error);
      }
    }
  }

  async validate(req: any) {
    const idToken = req.body.idToken || req.headers.authorization?.replace('Bearer ', '');

    if (!idToken) {
      throw new UnauthorizedException('No ID token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      let user = await this.usersService.findByEmail(decodedToken.email);
      
      if (!user) {
        // Create user if doesn't exist
        user = await this.usersService.createOAuthUser(
          decodedToken.email,
          decodedToken.name || decodedToken.email?.split('@')[0],
        );
      }

      return { userId: user.id, email: user.email };
    } catch (error) {
      this.logger.error('Firebase token verification failed', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
