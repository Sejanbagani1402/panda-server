import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto, GoalStatus } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { QueryGoalsDto } from './dto/query-goals.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        ...createGoalDto,
        userId,
        status: createGoalDto.status || GoalStatus.ACTIVE,
        targetDate: createGoalDto.targetDate ? new Date(createGoalDto.targetDate) : null,
      },
      include: {
        milestones: true,
        actions: true,
      },
    });
  }

  async findAll(userId: string, query: QueryGoalsDto) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [goals, total] = await Promise.all([
      this.prisma.goal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          milestones: true,
          actions: true,
        },
      }),
      this.prisma.goal.count({ where }),
    ]);

    return {
      goals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        milestones: true,
        actions: true,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return goal;
  }

  async update(id: string, userId: string, updateGoalDto: UpdateGoalDto) {
    const goal = await this.findOne(id, userId);

    return this.prisma.goal.update({
      where: { id },
      data: {
        ...updateGoalDto,
        targetDate: updateGoalDto.targetDate ? new Date(updateGoalDto.targetDate) : undefined,
      },
      include: {
        milestones: true,
        actions: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.goal.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, userId: string, status: GoalStatus) {
    await this.findOne(id, userId);

    return this.prisma.goal.update({
      where: { id },
      data: { status },
      include: {
        milestones: true,
        actions: true,
      },
    });
  }

  async getGoalStatistics(userId: string) {
    const [total, active, completed, paused] = await Promise.all([
      this.prisma.goal.count({ where: { userId } }),
      this.prisma.goal.count({ where: { userId, status: GoalStatus.ACTIVE } }),
      this.prisma.goal.count({ where: { userId, status: GoalStatus.COMPLETED } }),
      this.prisma.goal.count({ where: { userId, status: GoalStatus.PAUSED } }),
    ]);

    return {
      total,
      active,
      completed,
      paused,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
