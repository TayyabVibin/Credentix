import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity('payment_events')
export class PaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'payment_id' })
  paymentId!: string;

  @ManyToOne(() => Payment, (payment) => payment.events)
  @JoinColumn({ name: 'payment_id' })
  payment!: Payment;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'from_status' })
  fromStatus!: string | null;

  @Column({ type: 'varchar', length: 32, name: 'to_status' })
  toStatus!: string;

  @Column({ type: 'varchar', length: 32, name: 'event_source' })
  eventSource!: string;

  @Column({ type: 'jsonb', nullable: true, name: 'event_payload' })
  eventPayload!: Record<string, unknown> | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
