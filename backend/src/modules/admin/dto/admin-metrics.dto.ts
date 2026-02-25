export class AdminMetricsDto {
  dailyVolume!: { date: string; amountMinor: number }[];
  totalVolume7d!: number;
  successRate!: number;
  pendingCount!: number;
  authorizedCount!: number;
  capturedCount!: number;
}
