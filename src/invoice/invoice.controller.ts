import { Controller, Get, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('api/invoices')
export class InvoiceController {
  constructor(private readonly invoicesService: InvoiceService) {}

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.invoicesService.findOneById(+id);
  }
}
