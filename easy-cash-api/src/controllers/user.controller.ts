import { TokenService } from '@loopback/authentication';
import {
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import { inject } from '@loopback/core';
import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {  User } from '../models';
import { UserRepository } from '../repositories';
import { UserService } from '../services/userService';


export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject("userService")
    public userService: UserService,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  @post('/api/user/signup')
  @response(200, {
    description: 'User model instance',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: User
  ): Promise<User> {
    return this.userService.createUser(user);
  }

  @post('/api/user/login')
  @response(200, {
    description: 'To Login a user',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User,{
            exclude: ['id','emailVerified', 'accounts', 'balance']
          })
        },
      },
    }) user: User
  ): Promise<{ token: string }> {
    const verifiedUser = await this.userService.verifyCredentials(user)

    const userProfile = this.userService.convertToUserProfile(verifiedUser)

    const token = await this.jwtService.generateToken(userProfile);
      
    return { token };
  }

  @get('/api/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/api/users/{id}/cash')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            partial: true,
            exclude: ['id', 'email', 'accounts']
          }),
        },
      },
    })
    { balance }: User
  ): Promise<void> {
    await this.userService.updateCash(id, balance);
  }
}
