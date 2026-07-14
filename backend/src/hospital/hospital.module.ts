import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `report-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Allow images and PDFs only
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const ext = allowed.test(extname(file.originalname).toLowerCase());
        if (ext) {
          cb(null, true);
        } else {
          cb(new Error('Only images (jpg, png, gif) and documents (pdf, doc, docx) are allowed!'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
