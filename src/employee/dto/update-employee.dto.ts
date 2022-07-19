import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Input first name is too short',
  })
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Input last name is too short',
  })
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly number: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @IsString()
  @IsOptional()
  readonly photo: string;
}
