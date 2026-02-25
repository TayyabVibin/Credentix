import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CredentixPaymentService } from './credentix-payment.service';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: CredentixPaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPayment(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentService.findById(id);

    if (payment.userId !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    return PaymentResponseDto.fromEntity(payment);
  }
}
