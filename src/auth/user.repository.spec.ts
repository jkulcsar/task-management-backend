import { UserRepository } from './user.repository'
import { Test } from '@nestjs/testing'
import { InternalServerErrorException, ConflictException } from '@nestjs/common';

const mockCredentialDto = {username: 'TestUsername', password: 'TestPassword'}

describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
      let save
      beforeEach( () => {
          save = jest.fn()
          userRepository.create = jest.fn().mockReturnValue({save})
      })
    it('successfully signs up the user', () => {
        save.mockResolvedValue(undefined)
        expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow()
    })

    it('throws a conflict exception as username already exsits', () => {
        save.mockRejectedValue({code: '23505'})
        expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException)
    })

    it('throws a conflict exception as username already exsits', () => {
        save.mockRejectedValue({code: '23505'})
        expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
