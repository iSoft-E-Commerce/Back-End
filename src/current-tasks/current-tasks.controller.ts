import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentTasksService } from './current-tasks.service';

@ApiTags('Current Tasks Endpoints')
@Controller('tasks')
export class CurrentTasksController {
  constructor(private readonly currentTasksService: CurrentTasksService) {}
}
