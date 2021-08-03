import { Entity, model, property } from '@loopback/repository';


enum TranStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed"
}
@model()
export class Transfer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  senderId: string;

  @property({
    type: 'string',
  })
  recipientId?: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'string',
    required: true,
  })
  sourceAcctId: string;

  @property({
    type: 'string',
    required: true,
  })
  destAcctId: string;

  @property({
    type: 'date',
    required: true,
  })
  txnDate: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(TranStatus)
    }
  })
  status: string;


  constructor(data?: Partial<Transfer>) {
    super(data);
  }
}

export interface TransferRelations {
  // describe navigational properties here
}

export type TransferWithRelations = Transfer & TransferRelations;
