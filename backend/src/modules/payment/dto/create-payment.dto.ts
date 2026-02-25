import { IsString, IsIn } from 'class-validator';

const VALID_BUNDLES = ['bundle_10', 'bundle_25', 'bundle_50'] as const;

export class CreatePaymentDto {
  @IsString()
  @IsIn(VALID_BUNDLES)
  bundleId!: (typeof VALID_BUNDLES)[number];

  @IsString()
  returnUrl!: string;
}
