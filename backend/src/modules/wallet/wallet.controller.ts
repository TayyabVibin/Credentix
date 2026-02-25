import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { CredentixPaymentService } from '../payment/credentix-payment.service';
import { PurchaseDto } from './dto/purchase.dto';
import {
  WalletResponseDto,
  LedgerEntryDto,
  TransactionsResponseDto,
} from './dto/wallet-response.dto';
import { BundleId } from '../../../config/constants';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentService: CredentixPaymentService,
  ) {}

  @Get()
  async getWallet(
    @Request() req: { user: { id: string } },
  ): Promise<WalletResponseDto> {
    const [balance, entries] = await Promise.all([
      this.walletService.getBalance(req.user.id),
      this.walletService.getRecentEntries(req.user.id),
    ]);
    return WalletResponseDto.create(balance, entries);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req: { user: { id: string } },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TransactionsResponseDto> {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit ?? '20', 10) || 20),
    );

    const result = await this.walletService.getTransactions(
      req.user.id,
      pageNum,
      limitNum,
    );

    return {
      entries: result.entries.map(LedgerEntryDto.fromEntity),
      total: result.total,
      page: result.page,
      pages: result.pages,
    };
  }

  @Post('purchase')
  async purchase(
    @Request() req: { user: { id: string } },
    @Body() dto: PurchaseDto,
  ) {
    return this.paymentService.initiatePayment(
      req.user.id,
      dto.bundleId as BundleId,
      dto.returnUrl,
    );
  }
}
