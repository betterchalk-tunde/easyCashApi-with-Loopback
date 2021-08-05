import { repository } from '@loopback/repository';
import { Transfer, User } from '../models';
import { UserRepository } from '../repositories';
import { TransferRepository } from '../repositories'
import { TranStatus } from '../models'
import { HttpErrors } from '@loopback/rest';
import { genSalt, hash, compare } from 'bcryptjs';
import { securityId, UserProfile } from '@loopback/security';

const InvalidCredentialsError: string = 'Invalid email or password.';
const UserExist: string = 'User with this email already exists'

export class UserService {

    constructor(
        @repository(TransferRepository)
        private transferRepo: TransferRepository,
        @repository(UserRepository)
        private userRepo: UserRepository) {

    }


    async createUser(user: User): Promise<User> {
        const userFound = await this.userRepo.findOne({
            where: { email: user.email.toLowerCase() }
        })

        if (userFound) {
            throw new HttpErrors.Conflict(UserExist)
        }
        const hashedPassword = await hash(user.password, await genSalt())
        user.password = hashedPassword
        return this.userRepo.create(user)
    }

    async updateCash(id: string, balance: number) {
        const user = await this.userRepo.findById(id)
        user.balance += balance
        await this.userRepo.save(user)
    }


    async transfer(transfer: Transfer) {
        const { senderId, recipientId, amount }: Transfer = transfer

        const sender = await this.userRepo.findById(senderId)
        const recipient = await this.userRepo.findById(recipientId)

        if (sender.balance > amount) {
            if (sender.accounts) {
                transfer.sourceAcctId = sender.accounts[0].bankInfo?.accountNum as string
            } else {
                throw new HttpErrors.NotFound('No Account found for this user')
            }
            if (recipient.accounts) {
                transfer.destAcctId = recipient.accounts[0].bankInfo?.accountNum as string
            } else {
                throw new HttpErrors.NotFound('Recipient with this id does not have an account')
            }

            sender.balance -= amount
            recipient.balance += amount

            await this.userRepo.updateById(senderId, { balance: sender.balance })
            await this.userRepo.updateById(recipientId, { balance: recipient.balance })

            transfer.status = TranStatus.Completed

            transfer.txnDate = new Date().toISOString()

            return this.transferRepo.create(transfer)

        } else {
            throw new HttpErrors.Unauthorized('Insufficent Balance')
        }

    }

    async verifyCredentials({ email, password }: User): Promise<User> {
        const foundUser = await this.userRepo.findOne({
            where: { email: email.toLowerCase().trim() },
        })

        if (!foundUser) {
            throw new HttpErrors.Unauthorized(InvalidCredentialsError);
        }

        const passwordMatched = await compare(
            password,
            foundUser.password
        );

        if (!passwordMatched) {
            throw new HttpErrors.Unauthorized(InvalidCredentialsError);
        }

        return foundUser
    }

    convertToUserProfile(user: User): UserProfile {
        return {
            [securityId]: user.id!,
            id: user.id,
            email: user.email,
        };
    }
}