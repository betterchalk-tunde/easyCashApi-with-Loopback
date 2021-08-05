import {Entity, model, property} from '@loopback/repository';
import {Account} from './account.model'

@model()
export class User extends Entity {
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
  email: string;

  @property()
  emailVerified?: boolean;

  @property.array(Account)
  accounts?: Account[];

  @property({
    type: 'number',
    required: true,
  })
  balance: number;

  @property({
    type: 'string',
    required: true
  })
  password: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}


export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
