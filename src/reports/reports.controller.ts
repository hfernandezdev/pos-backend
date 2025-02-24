import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(Role.ADMIN, Role.MANAGER)
  getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getSalesReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('inventory')
  @Roles(Role.ADMIN, Role.MANAGER)
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }

  @Get('user-sales')
  @Roles(Role.ADMIN, Role.MANAGER)
  getUserSalesReport() {
    return this.reportsService.getUserSalesReport();
  }

  @Get('user-sales-by-date')
  @Roles(Role.ADMIN, Role.MANAGER)
  getUserSalesReportByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getUserSalesReportByDate(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
