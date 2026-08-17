import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async create(goalId: string, userId: string, createMilestoneDto: CreateMilestoneDto) {
    // Verify the goal belongs to the user
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.milestone.create({
      data: {
        ...createMilestoneDto,
        goalId,
        dueDate: createMilestoneDto.dueDate ? new Date(createMilestoneDto.dueDate) : null,
        completed: createMilestoneDto.completed || false,
      },
    });
  }

  async findAll(goalId: string, userId: string) {
    // Verify the goal belongs to the user
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.milestone.findMany({
      where: { goalId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        goal: true,
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return milestone;
  }

  async update(id: string, userId: string, updateMilestoneDto: UpdateMilestoneDto) {
    await this.findOne(id, userId);

    return this.prisma.milestone.update({
      where: { id },
      data: {
        ...updateMilestoneDto,
        dueDate: updateMilestoneDto.dueDate ? new Date(updateMilestoneDto.dueDate) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.milestone.delete({
      where: { id },
    });
  }

  async toggleComplete(id: string, userId: string) {
    const milestone = await this.findOne(id, userId);

    return this.prisma.milestone.update({
      where: { id },
      data: { completed: !milestone.completed },
    });
  }

  async getMilestoneProgress(goalId: string, userId: string) {
    // Verify the goal belongs to the user
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [total, completed] = await Promise.all([
      this.prisma.milestone.count({ where: { goalId } }),
      this.prisma.milestone.count({ where: { goalId, completed: true } }),
    ]);

    return {
      total,
      completed,
      remaining: total - completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
