import { Controller, Get, Post, Put, Delete, Patch, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { QueryGoalsDto } from './dto/query-goals.dto';
import { GoalStatus } from './dto/create-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query: QueryGoalsDto) {
    return this.goalsService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  async getStatistics(@Request() req) {
    return this.goalsService.getGoalStatistics(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, req.user.userId, updateGoalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Request() req, @Body('status') status: GoalStatus) {
    return this.goalsService.updateStatus(id, req.user.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.goalsService.remove(id, req.user.userId);
  }
}
