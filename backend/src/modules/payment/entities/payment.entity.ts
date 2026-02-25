import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { User } from '../../user/entities/user.entity';
import { PaymentEvent } from './payment-event.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 64, unique: true, name: 'merchant_reference' })
  merchantReference!: string;

  @Column({ type: 'varchar', length: 64, unique: true, nullable: true, name: 'psp_reference' })
  pspReference!: string | null;

  @Column({ type: 'int', name: 'amount_minor' })
  amountMinor!: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  @Index()
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.INITIATED })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'payment_method_type' })
  paymentMethodType!: string | null;

  @Column({ type: 'varchar', length: 64, unique: true, name: 'idempotency_key' })
  idempotencyKey!: string;

  @Column({ type: 'text', nullable: true, name: 'failure_reason' })
  failureReason!: string | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'authorized_at' })
  authorizedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'captured_at' })
  capturedAt!: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => PaymentEvent, (event) => event.payment)
  events!: PaymentEvent[];
}
