import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { CertificateService } from './certificate.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserType } from '../user/user.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AvailableCertificateResponseDto } from './dto/available-certificate-response.dto';
import { MyCertificateResponseDto } from './dto/my-certificate-response.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('/available')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAvailableCertificates(
    @Query() { limit, skip }: PaginationQueryDto,
  ): Promise<Array<AvailableCertificateResponseDto>> {
    return this.certificateService.listAvailableCertificates(limit, skip);
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyCertificates(
    @Query() { limit, skip }: PaginationQueryDto,
    @CurrentUser() currentUser: UserType,
  ): Promise<Array<MyCertificateResponseDto>> {
    return this.certificateService.listCertificatesByOwner(
      currentUser._id,
      limit,
      skip,
    );
  }

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
