import { repository } from '@loopback/repository';
import { Transfer, User } from '../models';
import { UserRepository } from '../repositories';
import { TransferRepository } from '../repositories'
import { TranStatus } from '../models'

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

    async updateCash(id: string, balance: number) {
        var prevBalance: number = 0
        await this.userRepo.findById(id)
            .then((user) => {
                prevBalance = user.balance
            })

        balance = prevBalance + balance
        return this.userRepo.updateById(id, { balance })

    }

    async transfer(transfer: Transfer) {
        var { senderId, recipientId, sourceAcctId, amount, destAcctId, txnDate, status } = transfer

        const sender = await this.userRepo.findById(senderId)
        const recipient = await this.userRepo.findById(recipientId)


        if (sender.accounts) {
            sourceAcctId = sender.accounts[0].bankInfo?.accountNum as string
        }
        if (recipient.accounts) {
            destAcctId = recipient.accounts[0].bankInfo?.accountNum as string
        }

        sender.balance = sender.balance - amount
        recipient.balance = recipient.balance + amount

        await this.userRepo.updateById(senderId, { balance: sender.balance })
        await this.userRepo.updateById(recipientId, { balance: recipient.balance })

        status = TranStatus.Completed

        txnDate = new Date().toISOString()

        return this.transferRepo.create({ senderId, recipientId, sourceAcctId, amount, destAcctId, txnDate, status })

    }
}