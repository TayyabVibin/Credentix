export class AdminWebhookLogDto {
  id!: string;
  pspReference!: string | null;
  eventCode!: string;
  success!: boolean;
  processedAt!: string | null;
  errorMessage!: string | null;
  createdAt!: string;
}
