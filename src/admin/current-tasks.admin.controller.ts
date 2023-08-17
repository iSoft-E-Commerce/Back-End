import {
  ConflictException,
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentTasksService } from 'src/current-tasks/current-tasks.service';
import { CurrentTasks } from 'src/types/types';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminCurrentTasksController {
  constructor(private readonly currentTasksService: CurrentTasksService) {}

  @ApiOperation({ summary: 'Get current tasks' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Tasks have been succesfully got',
    type: CurrentTasks,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Tasks do not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @Get('tasks')
  @UseGuards(JwtAuthGuard)
  getCurrentTasks(@Request() req): Promise<CurrentTasks> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.currentTasksService.getCurrentTasks();
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
