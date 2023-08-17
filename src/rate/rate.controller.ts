import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';
import { RateService } from './rate.service';

@ApiTags('Rate endpoints')
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @ApiOperation({ summary: 'Add rate' })
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    description: 'Rate has been successfully added',
    type: Rate,
  })
  @ApiUnauthorizedResponse({ description: 'No possibility to rate a product' })
  @ApiNotFoundResponse({ description: 'User or rating does not exist' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when saving the rate.',
  })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createRate(
    @Request() req,
    @Body() createRateDto: CreateRateDto,
  ): Promise<Rate> {
    if (req.user.role) {
      return this.rateService.createRate(req.user.id, createRateDto);
    } else {
      throw new ConflictException('No possibility to rate a product');
    }
  }

  @ApiOperation({ summary: 'Get checked rating' })
  @ApiOkResponse({
    description: 'Checked rating has been successfully got',
    type: [Rate],
  })
  @ApiNotFoundResponse({
    description: 'Product, rating or rate does not exist',
  })
  @Get('/checked/:productId')
  getCheckedRating(@Param('productId') productId: number): Promise<Rate[]> {
    return this.rateService.getCheckedRating(productId);
  }
}
