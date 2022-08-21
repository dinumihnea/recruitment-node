import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, {
    message: 'password must have more than 8 chars with at least one number',
  })
  password: string;
}

export class AuthResponseDto {
  accessToken: string;
}
