import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  createdAt!: Date;

  static fromEntity(user: { id: string; email: string; role: UserRole; createdAt: Date }): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
