import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserRole } from '../../common/enums/user-role.enum';

const SALT_ROUNDS = 12;

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      console.warn(
        'ADMIN_EMAIL and ADMIN_PASSWORD are not set, skipping admin seed',
      );
      return;
    }

    const existing = await this.userService.findByEmail(email);
    if (existing) {
      if (existing.role === UserRole.ADMIN) return;
      await this.userService.update(existing.id, { role: UserRole.ADMIN });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.userService.create({
      email,
      passwordHash,
      role: UserRole.ADMIN,
    });
  }
}
