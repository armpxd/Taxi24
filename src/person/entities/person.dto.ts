import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @MinLength(2, {
    message: 'The name must have at least 2 characters.',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'The lastname must have at least 2 characters.',
  })
  lastName: string;

  @IsPhoneNumber(null, {
    message: 'The phone number is not valid.',
  })
  phoneNumber: string;

  @IsEmail(
    {},
    {
      message: 'The email is not valid.',
    },
  )
  email: string;
}
