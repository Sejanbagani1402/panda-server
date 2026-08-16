import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class OnboardingService {
  constructor(private usersService: UsersService) {}

  async completeOnboarding(userId: string, onboardingData: { name: string; profileImage?: string; preferences?: Record<string, any> }) {
    return this.usersService.completeOnboarding(userId, onboardingData);
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      isOnboarded: user.isOnboarded || false,
      canSkip: !(user.isOnboarded || false),
    };
  }

  async skipOnboarding(userId: string) {
    return this.usersService.updateOnboardingStatus(userId, true);
  }
}
