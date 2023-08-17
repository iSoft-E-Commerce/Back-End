import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateContactsDto } from './dto/update-contacts.dto';
import { Contacts } from './entities/contacts.entity';
import { Message } from 'src/types/types';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private readonly contactsRepository: Repository<Contacts>,
  ) {}
  async getContacts(): Promise<Contacts[]> {
    const contacts = await this.contactsRepository.find();
    if (!contacts) {
      throw new NotFoundException('Contacts not found');
    }
    return contacts;
  }

  async updateContacts(updateContactsDto: UpdateContactsDto): Promise<Message> {
    const { contactsId, ...contactsData } = updateContactsDto;
    const contacts = await this.contactsRepository.findOne({
      where: { id: contactsId },
    });
    try {
      if (!contacts) {
        const newContactsData = this.contactsRepository.create(contactsData);
        await this.contactsRepository.save(newContactsData);
        return { message: 'Contacts info has been successfully created' };
      }
      await this.contactsRepository.update(contacts.id, { ...contactsData });
      return { message: 'Contacts info has been successfully updated' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when updating contacts info',
      );
    }
  }
}
