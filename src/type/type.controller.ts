import { Controller, Get } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from './entities/type.entity';
import { TypeService } from './type.service';

@ApiTags('Type Endpoints')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiOperation({ summary: 'Get all types of devices' })
  @ApiOkResponse({
    description: 'All types were successfully gotten.',
    type: [Type],
  })
  @ApiConflictResponse({ description: 'Types are not found.' })
  @Get('getAll')
  getTypes(): Promise<Type[]> {
    return this.typeService.getTypes();
  }
}
