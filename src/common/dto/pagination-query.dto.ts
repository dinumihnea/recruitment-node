import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @Min(0)
  skip: number;

  @IsInt()
  @IsPositive()
  @Max(100)
  limit: number;
}
