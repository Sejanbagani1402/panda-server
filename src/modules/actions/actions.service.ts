import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  async create(goalId: string, userId: string, createActionDto: CreateActionDto) {
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

    return this.prisma.action.create({
      data: {
        ...createActionDto,
        goalId,
        dueDate: createActionDto.dueDate ? new Date(createActionDto.dueDate) : null,
        completed: createActionDto.completed || false,
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

    return this.prisma.action.findMany({
      where: { goalId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const action = await this.prisma.action.findUnique({
      where: { id },
      include: {
        goal: true,
      },
    });

    if (!action) {
      throw new NotFoundException('Action not found');
    }

    if (action.goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return action;
  }

  async update(id: string, userId: string, updateActionDto: UpdateActionDto) {
    await this.findOne(id, userId);

    return this.prisma.action.update({
      where: { id },
      data: {
        ...updateActionDto,
        dueDate: updateActionDto.dueDate ? new Date(updateActionDto.dueDate) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.action.delete({
      where: { id },
    });
  }

  async toggleComplete(id: string, userId: string) {
    const action = await this.findOne(id, userId);

    return this.prisma.action.update({
      where: { id },
      data: { completed: !action.completed },
    });
  }

  async getActionProgress(goalId: string, userId: string) {
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
      this.prisma.action.count({ where: { goalId } }),
      this.prisma.action.count({ where: { goalId, completed: true } }),
    ]);

    return {
      total,
      completed,
      remaining: total - completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  async getDueActions(userId: string, days: number = 7) {
    const actions = await this.prisma.action.findMany({
      where: {
        goal: {
          userId,
        },
        completed: false,
        dueDate: {
          lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        goal: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return actions;
  }
}
