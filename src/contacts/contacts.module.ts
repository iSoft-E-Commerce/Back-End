import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contacts } from './entities/contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacts]), JwtModule],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
