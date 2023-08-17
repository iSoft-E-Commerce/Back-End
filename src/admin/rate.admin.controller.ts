import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ModerateRateDto } from 'src/rate/dto/moderate-rate.dto';
import { Rate } from 'src/rate/entities/rate.entity';
import { RateService } from 'src/rate/rate.service';
import { Message } from 'src/types/types';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminRateController {
  constructor(private readonly rateService: RateService) {}

  @ApiOperation({ summary: 'Get product rating' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Product rating has been successfully got',
    type: [Rate],
  })
  @ApiUnauthorizedResponse({ description: 'No possibility to rate a product' })
  @ApiNotFoundResponse({
    description: 'Product, rating or rate does not exist',
  })
  @Get('rate/:productId')
  @UseGuards(JwtAuthGuard)
  getAllRating(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Rate[]> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.rateService.getAllRating(productId);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'Moderate rate' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Rate has been successfully moderated',
    type: Message,
  })
  @ApiUnauthorizedResponse({ description: 'No possibility to rate a product' })
  @ApiBadRequestResponse({ description: 'No changes were made.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occured when moderating the rate',
  })
  @ApiNotFoundResponse({ description: 'Current rate does not exist' })
  @Put('/moderate-rate/:rateId')
  @UseGuards(JwtAuthGuard)
  moderateUserReview(
    @Request() req,
    @Param('rateId') rateId: number,
    @Body() moderateRateDto: ModerateRateDto,
  ): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.rateService.moderateUserReview(
        rateId,
        req.user.firstName,
        moderateRateDto,
      );
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'Delete rate' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Rate has been successfully deleted',
    type: Message,
  })
  @ApiUnauthorizedResponse({ description: 'No possibility to rate a product' })
  @ApiBadRequestResponse({ description: 'No changes were made.' })
  @Delete('/moderate-rate/:rateId')
  @UseGuards(JwtAuthGuard)
  deleteRate(
    @Request() req,
    @Param('rateId') rateId: number,
  ): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.rateService.deleteRate(rateId);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }
}
