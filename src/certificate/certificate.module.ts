import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateService } from './certificate.service';
import { Certificate, CertificateSchema } from './certificate.schema';
import { CertificateController } from './certificate.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }])
  ],
  controllers: [CertificateController],
  providers: [CertificateService]
})
export class CertificateModule {
}
