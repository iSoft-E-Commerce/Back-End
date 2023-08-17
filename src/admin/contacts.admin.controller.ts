import {
  Body,
  ConflictException,
  Controller,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ContactsService } from 'src/contacts/contacts.service';
import { UpdateContactsDto } from 'src/contacts/dto/update-contacts.dto';
import { Message } from 'src/types/types';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @ApiOperation({
    summary: 'contactsId(in Dto) ? Update Contacts : Create Contacts',
  })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Contacts has been succesfully updated',
    type: Message,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Contacts do not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when updating contacts.',
  })
  @Put('update-contacts')
  @UseGuards(JwtAuthGuard)
  updateContacts(
    @Request() req,
    @Body() updateContactsDto: UpdateContactsDto,
  ): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.contactsService.updateContacts(updateContactsDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
