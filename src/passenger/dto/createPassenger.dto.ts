import { IsString, MinLength, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';

export class CreatePassengerDto {
  id: number;

  @IsString()
  @MinLength(2, { message: 'The name must have at least 2 characters.' })
  @IsNotEmpty({ message: 'The name should not be empty.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'The last name should not be empty.' })
  lastName: string;

  @IsPhoneNumber(null, { message: 'The phone number is not valid.' })
  phoneNumber: string;

  @IsEmail({}, { message: 'The email is not valid.' })
  email: string;
}
