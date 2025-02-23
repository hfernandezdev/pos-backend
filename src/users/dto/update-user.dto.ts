import { IsEmail, IsOptional, IsPhoneNumber, IsDateString, IsEnum } from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other', 'Prefer not to say'])
  gender?: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
