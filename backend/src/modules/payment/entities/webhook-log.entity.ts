import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, name: 'raw_payload_hash' })
  rawPayloadHash!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'psp_reference' })
  pspReference!: string | null;

  @Column({ type: 'varchar', length: 64, name: 'event_code' })
  eventCode!: string;

  @Column({ type: 'boolean' })
  success!: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
  processedAt!: Date | null;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage!: string | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
