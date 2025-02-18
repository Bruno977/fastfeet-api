import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encrypter } from 'src/domain/deliveries/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}
  encrypt(payload: Record<string, unknown>): Promise<string> {
    console.log('aqwui');
    return this.jwtService.signAsync(payload);
  }
}
