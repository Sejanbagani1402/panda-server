import { Controller, Get, Put, Patch, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('onboarding')
  async completeOnboarding(@Request() req, @Body() completeOnboardingDto: CompleteOnboardingDto) {
    return this.usersService.completeOnboarding(req.user.userId, completeOnboardingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  async updatePreferences(@Request() req, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(req.user.userId, updatePreferencesDto.preferences || {});
  }

  @UseGuards(JwtAuthGuard)
  @Patch('preferences')
  async patchPreferences(@Request() req, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(req.user.userId, updatePreferencesDto.preferences || {});
  }

  @UseGuards(JwtAuthGuard)
  @Delete('preferences')
  async resetPreferences(@Request() req) {
    return this.usersService.resetPreferences(req.user.userId);
  }
}
