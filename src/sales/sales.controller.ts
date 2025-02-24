import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.salesService.create(createOrderDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }
}
