import { Repository, EntityRepository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    // in an entity, the right way to create a new
    // entity is not with new() but create()
    //const user = new User()
    const user = this.create()

    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save()
    } catch (error) {
      if (error.code === '23505') {
        // errorcode for duplicate item, violation of unique decorator of the entity
        throw new ConflictException('Username already exists.')
      } else {
        throw new InternalServerErrorException()
      }
    }

    // usual pattern is to return the object that was created and saved
    // but in this case we certainly don't want to return the
    // user object with cleartext password
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto

    const user = await this.findOne({ username })
    if (user && (await user.validatePassword(password))) {
      return user.username
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
