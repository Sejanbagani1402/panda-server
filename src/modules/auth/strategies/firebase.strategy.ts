import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  private readonly logger = new Logger(FirebaseStrategy.name);
  private firebaseAdmin: any;

  constructor(private usersService: UsersService) {
    super();
    this.initializeFirebase();
  }

  private async initializeFirebase() {
    try {
      // Dynamic import to avoid loading Firebase if not configured
      const admin = await import('firebase-admin');
      
      if (!this.firebaseAdmin) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
          this.firebaseAdmin = admin.initializeApp({
            credential: (admin as any).credential.cert(serviceAccount),
          });
          this.logger.log('Firebase initialized successfully');
        } else {
          this.logger.warn('Firebase configuration incomplete, OAuth will be disabled');
        }
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase', error);
    }
  }

  async validate(req: any) {
    if (!this.firebaseAdmin) {
      throw new UnauthorizedException('Firebase is not configured');
    }

    const idToken = req.body.idToken || req.headers.authorization?.replace('Bearer ', '');

    if (!idToken) {
      throw new UnauthorizedException('No ID token provided');
    }

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);
      
      if (!decodedToken.email) {
        throw new UnauthorizedException('Email is required from Firebase token');
      }
      
      let user = await this.usersService.findByEmail(decodedToken.email);
      
      if (!user) {
        // Create user if doesn't exist
        user = await this.usersService.createOAuthUser(
          decodedToken.email,
          decodedToken.name || decodedToken.email?.split('@')[0],
        );
      }

      if (!user) {
        throw new UnauthorizedException('Failed to create or retrieve user');
      }

      return { userId: user.id, email: user.email };
    } catch (error) {
      this.logger.error('Firebase token verification failed', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
