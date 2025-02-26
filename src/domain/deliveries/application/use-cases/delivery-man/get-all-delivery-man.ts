import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface GetAllDeliveryManRequest {
  role: RoleProps;
  page: number;
}
@Injectable()
export class GetAllDeliveryMenUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ role, page }: GetAllDeliveryManRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-all-delivery-man');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const deliveryMen = await this.deliveryManRepository.findMany({ page });
    return { deliveryMen };
  }
}
