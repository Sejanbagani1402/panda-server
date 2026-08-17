import { Controller, Get, Post, Put, Delete, Patch, UseGuards, Request, Body, Param } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('goals/:goalId/milestones')
export class MilestonesController {
  constructor(private milestonesService: MilestonesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Param('goalId') goalId: string, @Request() req, @Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(goalId, req.user.userId, createMilestoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Param('goalId') goalId: string, @Request() req) {
    return this.milestonesService.findAll(goalId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getProgress(@Param('goalId') goalId: string, @Request() req) {
    return this.milestonesService.getMilestoneProgress(goalId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.milestonesService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() updateMilestoneDto: UpdateMilestoneDto) {
    return this.milestonesService.update(id, req.user.userId, updateMilestoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle')
  async toggleComplete(@Param('id') id: string, @Request() req) {
    return this.milestonesService.toggleComplete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.milestonesService.remove(id, req.user.userId);
  }
}
