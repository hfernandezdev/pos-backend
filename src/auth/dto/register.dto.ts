import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber, IsDateString, IsEnum } from 'class-validator';
import { Role } from '../roles.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

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
