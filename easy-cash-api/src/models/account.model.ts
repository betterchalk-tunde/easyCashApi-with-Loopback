import { Entity, model, property } from '@loopback/repository';

enum AccountTypes {
  BANK = "Bank",
  CASH = "Cash",
  CREDITCARD = "credit card"
}

@model()
class BankInfo{
  @property()
  bankName: "string"
  @property()
  accountNum: "string"
}

@model()
export class Account extends Entity {
  @property({
    type: 'string',
  })
  id: string;

  @property({
    required: false,
  })
  type?: AccountTypes;

  @property({
    type: BankInfo
  })
  bankInfo?: BankInfo


  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
