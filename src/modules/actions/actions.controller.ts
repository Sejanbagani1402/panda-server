import { Controller, Get, Post, Put, Delete, Patch, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('goals/:goalId/actions')
export class ActionsController {
  constructor(private actionsService: ActionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Param('goalId') goalId: string, @Request() req, @Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(goalId, req.user.userId, createActionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Param('goalId') goalId: string, @Request() req) {
    return this.actionsService.findAll(goalId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getProgress(@Param('goalId') goalId: string, @Request() req) {
    return this.actionsService.getActionProgress(goalId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.actionsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() updateActionDto: UpdateActionDto) {
    return this.actionsService.update(id, req.user.userId, updateActionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle')
  async toggleComplete(@Param('id') id: string, @Request() req) {
    return this.actionsService.toggleComplete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.actionsService.remove(id, req.user.userId);
  }
}

@Controller('user/actions')
export class ActionsGlobalController {
  constructor(private actionsService: ActionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('due')
  async getDueActions(@Request() req, @Query('days') days?: string) {
    return this.actionsService.getDueActions(req.user.userId, days ? parseInt(days) : 7);
  }
}
