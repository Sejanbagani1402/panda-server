import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string, name?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
        authProvider: 'LOCAL',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createOAuthUser(email: string, name?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser;
      return userWithoutPassword;
    }

    // Create OAuth user with a random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
        authProvider: 'FIREBASE',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as any;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmailWithoutPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as any;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as any;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateOnboardingStatus(userId: string, isOnboarded: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnboarded: isOnboarded },
    });
  }

  async updateProfile(userId: string, updateData: { name?: string; profileImage?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.profileImage && { profileImage: updateData.profileImage }),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async completeOnboarding(userId: string, onboardingData: { name: string; preferences?: Record<string, any> }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: onboardingData.name,
        preferences: onboardingData.preferences || {},
        isOnboarded: true,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.preferences || {};
  }

  async updatePreferences(userId: string, preferences: Record<string, any>) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedPreferences = {
      ...(user.preferences as Record<string, any> || {}),
      ...preferences,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { preferences: updatedPreferences },
      select: { preferences: true },
    });

    return updatedUser.preferences;
  }

  async resetPreferences(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { preferences: {} },
      select: { preferences: true },
    });

    return user.preferences;
  }
}
