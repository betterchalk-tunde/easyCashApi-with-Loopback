import { inject } from '@loopback/core';
import { authenticate } from '@loopback/authentication';
import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  post,
  getModelSchemaRef,
  requestBody,
  response,
  param,
} from '@loopback/rest';
import { Transfer } from '../models';
import { TransferRepository } from '../repositories';
import { UserService } from '../services/userService';


// @authenticate('jwt')
export class TransferController {
  constructor(
    @inject("userService")
    public userService: UserService,
    @repository(TransferRepository)
    public transferRepository: TransferRepository
  ) { }

  @post('/api/transfer')
  @response(200, {
    description: 'Transfer model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Transfer) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {
            title: 'NewTransfer',
            exclude: ['id', 'destAcctId', 'sourceAcctId', 'txnDate', 'status']
          }),
        },
      },
    })
    transfer: Omit<Transfer, 'id'>,
  ): Promise<Transfer> {
    return await this.userService.transfer(transfer);
  }

  @get('/transfers')
  @response(200, {
    description: 'Array of Transfer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transfer, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Transfer) filter?: Filter<Transfer>,
  ): Promise<Transfer[]> {
    return this.transferRepository.find(filter);
  }

}
