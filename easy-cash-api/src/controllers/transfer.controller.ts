import { inject } from '@loopback/core';
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
  RestBindings,
  RequestContext
} from '@loopback/rest';
import { Transfer } from '../models';
import { TransferRepository } from '../repositories';
import { UserService } from '../services/userService';

export class TransferController {
  constructor(
    @inject("userService")
    public userService: UserService,
    @repository(TransferRepository)
    public transferRepository: TransferRepository,
    @inject(RestBindings.Http.CONTEXT)
    private requestCtx: RequestContext
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
  ) {
    const { response } = this.requestCtx
    try {
      return response.status(200).send(await this.userService.transfer(transfer));
    } catch (error) {
      return response.status(400).send({
        "error": {
          "statusCode": 403,
          "name": "Error",
          "message": `${error}`
        }
      })
    }


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
