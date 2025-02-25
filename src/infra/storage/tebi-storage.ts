import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Uploader } from 'src/domain/deliveries/application/storage/uploader';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}
@Injectable()
export class TebiStorage implements Uploader {
  private client: S3Client;
  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: 'https://s3.tebi.io',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_ACCESS_SECRET_KEY'),
      },
      region: 'global',
    });
  }
  async upload({ fileName, fileType, body }: UploadParams) {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    );
    return {
      url: uniqueFileName,
    };
  }
}
