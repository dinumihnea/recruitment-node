import { IsMongoId } from 'class-validator';

export class TransferCertificateDto {

  @IsMongoId({
    message: 'id must be a valid Object ID'
  })
  id: string;

  @IsMongoId({
    message: 'newOwnerId must be a valid Object ID'
  })
  newOwnerId: string;
}
