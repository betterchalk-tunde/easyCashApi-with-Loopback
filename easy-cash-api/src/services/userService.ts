import { repository } from '@loopback/repository';
import { Transfer, User } from '../models';
import { UserRepository } from '../repositories';
import { TransferRepository } from '../repositories'

export class UserService {
    constructor(
        @repository(TransferRepository)
        private transferRepo: TransferRepository,
        @repository(UserRepository)
        private userRepo: UserRepository) {

    }

    async createUser(user: User) {
        return this.userRepo.create(user)
    }

    async updateCash(id:string, balance:number){
        return this.userRepo.updateById(id, {balance})

    }

    async transfer(transfer: Transfer){

    }
       
}