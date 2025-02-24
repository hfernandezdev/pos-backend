import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly salesService: SalesService,
    private readonly inventoryService: InventoryService,
    private readonly usersService: UsersService,
  ) {}

  async getSalesReport(startDate: Date, endDate: Date) {
    const orders = await this.salesService.findAll();
    return orders.filter(
      (order) =>
        order.createdAt >= startDate && order.createdAt <= endDate,
    );
  }

  async getInventoryReport() {
    const products = await this.inventoryService.findAll();
    const lowStockProducts = products.filter(
      (product) => product.stock < 10,
    );
    const topSellingProducts = products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
    return { lowStockProducts, topSellingProducts };
  }

  async getUserSalesReport() {
    const users = await this.usersService.findAll();
    const usersWithSales = await Promise.all(
      users.map(async (user) => {
        const orders = await this.salesService.findAll();
        const userOrders = orders.filter(
          (order) => order.userId === user.id,
        );
        const totalSales = userOrders.reduce(
          (sum, order) => sum + order.totalPrice,
          0,
        );
        return { ...user, totalSales };
      }),
    );
    return usersWithSales.sort((a, b) => b.totalSales - a.totalSales);
  }

  async getUserSalesReportByDate(startDate: Date, endDate: Date) {
    const users = await this.usersService.findAll();
    const usersWithSales = await Promise.all(
      users.map(async (user) => {
        const orders = await this.salesService.findAll();
        const userOrders = orders.filter(
          (order) =>
            order.userId === user.id &&
            order.createdAt >= startDate &&
            order.createdAt <= endDate,
        );
        const totalSales = userOrders.reduce(
          (sum, order) => sum + order.totalPrice,
          0,
        );
        return { ...user, totalSales };
      }),
    );
    return usersWithSales.sort((a, b) => b.totalSales - a.totalSales);
  }
}
