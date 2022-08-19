import { Body, Controller, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { CertificateService } from './certificate.service';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Patch()
  @UsePipes(new ValidationPipe({ transform: true }))
  async transfer(@Body() dto: TransferCertificateDto): Promise<void> {
    return this.certificateService.transferCertificate(dto.id, dto.newOwnerId);
  }
}
