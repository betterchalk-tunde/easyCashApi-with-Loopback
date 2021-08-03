import {Entity, model, property} from '@loopback/repository';
import {Account} from './account.model'

@model()
export class User extends Entity {
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
  })
  email: string;

  @property({
    type: 'array',
    //itemType: 'string', removed this cause i thought the Account array has defined the item types 
    required: true,
  })
  accounts: Account[];

  @property({
    type: 'number',
    required: true,
  })
  balance: number;


  constructor(data?: Partial<User>) {
    super(data);
  }
}



export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
