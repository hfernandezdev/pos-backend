import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createProductDto: CreateProductDto) {
    return this.inventoryService.create(createProductDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Get('code/:code')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  findByCode(@Param('code') code: string) {
    return this.inventoryService.findByCode(code);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.inventoryService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  @Put(':id/stock')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.inventoryService.updateStock(+id, quantity);
  }
}
