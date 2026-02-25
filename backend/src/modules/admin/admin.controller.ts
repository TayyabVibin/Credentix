import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminPaymentService } from './admin-payment.service';
import { AdminMetricsService } from './admin-metrics.service';
import { AdminWebhookService } from './admin-webhook.service';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminPaymentService: AdminPaymentService,
    private readonly adminMetricsService: AdminMetricsService,
    private readonly adminWebhookService: AdminWebhookService,
  ) {}

  @Get('payments')
  listPayments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: PaymentStatus,
    @Query('currency') currency?: string,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.adminPaymentService.listPayments({
      page,
      limit,
      status,
      currency,
      search,
      dateFrom,
      dateTo,
    });
  }

  @Get('payments/:id')
  async getPaymentDetail(@Param('id') id: string) {
    const detail = await this.adminPaymentService.getPaymentDetail(id);
    if (!detail) throw new NotFoundException('Payment not found');
    return detail;
  }

  @Get('metrics')
  getMetrics() {
    return this.adminMetricsService.getMetrics();
  }

  @Get('webhooks')
  listWebhooks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminWebhookService.listWebhooks(page, limit);
  }
}
