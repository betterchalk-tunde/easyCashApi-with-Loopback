import { Entity, model, property } from '@loopback/repository';

enum AccountTypes {
  Bank = "Bank",
  Cash = "Cash",
  CreditCard = "credit card"
}
@model()
export class Account extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(AccountTypes)
    }
  })
  type: string;

  @property({
    type: 'object',
    required: true,
    properties: {
      bankName: "string",
      accountNum: "string"
    }
  })
  bankInfo: object;


  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
