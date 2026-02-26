import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  fullName!: string | null;
  company!: string | null;
  userTitle!: string | null;
  useCase!: string | null;
  avatarUrl!: string | null;
  country!: string | null;
  businessType!: string | null;
  createdAt!: Date;

  static fromEntity(user: {
    id: string;
    email: string;
    role: UserRole;
    fullName?: string | null;
    company?: string | null;
    userTitle?: string | null;
    useCase?: string | null;
    avatarUrl?: string | null;
    country?: string | null;
    businessType?: string | null;
    createdAt: Date;
  }): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.fullName = user.fullName ?? null;
    dto.company = user.company ?? null;
    dto.userTitle = user.userTitle ?? null;
    dto.useCase = user.useCase ?? null;
    dto.avatarUrl = user.avatarUrl ?? null;
    dto.country = user.country ?? null;
    dto.businessType = user.businessType ?? null;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
