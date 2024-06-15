import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findAll(): Promise<any[]> {
    const invoices = await this.invoiceRepository.find({
      relations: [
        'ride',
        'ride.passenger',
        'ride.passenger.person',
        'ride.driver',
        'ride.driver.person',
        'ride.startLocation',
        'ride.endLocation',
      ],
    });

    return invoices.map(
      (invoice) =>
        new GetInvoiceDto(
          invoice.id,
          invoice.ride.passenger.id,
          invoice.ride.passenger.person.name,
          invoice.ride.id,
          invoice.ride.driver.person.name,
          invoice.amount,
        ),
    );
  }

  async findOneById(id: number): Promise<GetInvoiceDto> {
    if (isNaN(id)) {
      throw new BadRequestException('the id need to be a number');
    }

    const invoice: Invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: [
        'ride',
        'ride.passenger',
        'ride.passenger.person',
        'ride.driver',
        'ride.driver.person',
        'ride.startLocation',
        'ride.endLocation',
      ],
    });

    if (!invoice) {
      throw new NotFoundException(`No invoice with the ${id}`);
    }

    return new GetInvoiceDto(
      invoice.id,
      invoice.ride.passenger.id,
      invoice.ride.passenger.person.name,
      invoice.ride.id,
      invoice.ride.driver.person.name,
      invoice.amount,
    );
  }
}
