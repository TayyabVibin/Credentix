export class AdminPaymentListItemDto {
  id!: string;
  userId!: string;
  userEmail!: string;
  merchantReference!: string;
  pspReference!: string | null;
  amountMinor!: number;
  currency!: string;
  status!: string;
  createdAt!: string;
}

export class AdminPaymentDetailDto extends AdminPaymentListItemDto {
  paymentMethodType!: string | null;
  failureReason!: string | null;
  authorizedAt!: string | null;
  capturedAt!: string | null;
  events!: AdminPaymentEventDto[];
}

export class AdminPaymentEventDto {
  id!: string;
  fromStatus!: string | null;
  toStatus!: string;
  eventSource!: string;
  createdAt!: string;
}
