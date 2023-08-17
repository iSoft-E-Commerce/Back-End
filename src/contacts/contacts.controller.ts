import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { Contacts } from './entities/contacts.entity';

@ApiTags('Contacts Endpoints')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @ApiOperation({ summary: 'Get contacts info' })
  @ApiOkResponse({
    description: 'Contacts info has been succesfully got',
    type: [Contacts],
  })
  @Get()
  getContacts(): Promise<Contacts[]> {
    return this.contactsService.getContacts();
  }
}
