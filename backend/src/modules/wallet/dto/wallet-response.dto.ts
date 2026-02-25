import { LedgerEntry } from '../entities/ledger-entry.entity';

export class LedgerEntryDto {
  id!: string;
  credits!: number;
  balanceAfter!: number;
  paymentId!: string;
  createdAt!: Date;

  static fromEntity(entry: LedgerEntry): LedgerEntryDto {
    const dto = new LedgerEntryDto();
    dto.id = entry.id;
    dto.credits = entry.credits;
    dto.balanceAfter = entry.balanceAfter;
    dto.paymentId = entry.paymentId;
    dto.createdAt = entry.createdAt;
    return dto;
  }
}

export class WalletResponseDto {
  balance!: number;
  recentTransactions!: LedgerEntryDto[];

  static create(balance: number, entries: LedgerEntry[]): WalletResponseDto {
    const dto = new WalletResponseDto();
    dto.balance = balance;
    dto.recentTransactions = entries.map(LedgerEntryDto.fromEntity);
    return dto;
  }
}

export class TransactionsResponseDto {
  entries!: LedgerEntryDto[];
  total!: number;
  page!: number;
  pages!: number;
}
