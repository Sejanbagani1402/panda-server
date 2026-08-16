import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompleteOnboardingDto } from '../users/dto/complete-onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getOnboardingStatus(@Request() req) {
    return this.onboardingService.getOnboardingStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async completeOnboarding(@Request() req, @Body() completeOnboardingDto: CompleteOnboardingDto) {
    return this.onboardingService.completeOnboarding(req.user.userId, completeOnboardingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('skip')
  async skipOnboarding(@Request() req) {
    return this.onboardingService.skipOnboarding(req.user.userId);
  }
}
