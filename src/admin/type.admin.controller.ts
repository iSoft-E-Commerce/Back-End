import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTypeDto } from 'src/type/dto/create-type.dto';
import { UpdateTypeDto } from 'src/type/dto/update-type.dto';
import { Type } from 'src/type/entities/type.entity';
import { TypeService } from 'src/type/type.service';
import { Message } from 'src/types/types';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminTypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiOperation({ summary: 'Create Types of devices' })
  @ApiCreatedResponse({
    description: 'A type was successfully created.',
    type: Type,
  })
  @ApiBearerAuth('Token')
  @ApiConflictResponse({
    description: 'No rights in user or current type already exists',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when saving the type.',
  })
  @Post('create-type')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createType(
    @Request() req,
    @Body() createTypeDto: CreateTypeDto,
  ): Promise<Type> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.typeService.createType(createTypeDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Edit the type' })
  @ApiOkResponse({ description: 'Type has been updated.', type: Message })
  @ApiBearerAuth('Token')
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when updating the type.',
  })
  @Put('edit-type/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateType(
    @Request() req,
    @Body() updateTypeDto: UpdateTypeDto,
    @Param('id') id: number,
  ): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.typeService.updateType(id, updateTypeDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Delete the type' })
  @ApiOkResponse({ description: 'Type has been deleted.', type: Message })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: 'Current type not found.' })
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when deleting the type.',
  })
  @Delete('type/:id')
  @UseGuards(JwtAuthGuard)
  deleteType(@Request() req, @Param('id') id: number): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.typeService.deleteType(id);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
