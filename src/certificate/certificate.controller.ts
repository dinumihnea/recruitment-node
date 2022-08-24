import {
  Body,
  Controller,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { CertificateService } from './certificate.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserType } from '../user/user.schema';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Patch()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async transfer(
    @Body() dto: TransferCertificateDto,
    @CurrentUser() currentUser: UserType,
  ): Promise<boolean> {
    return this.certificateService.transferCertificate(
      dto.id,
      dto.newOwnerId,
      currentUser,
    );
  }
}
