import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // If anyone asks UsersService, give him fakeUsersService
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hadhed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('asdf');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    expect.assertions(2);

    await service.signup('asdf@asdf.com', 'mypassword');

    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    expect.assertions(2);

    try {
      await service.signin('ksdfjskjsdfdfsdfsdfdj@gmail.com', 'kljksfdk');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    expect.assertions(2);

    await service.signup('akjsdfj@gmail.com', 'invalidpassword');

    try {
      await service.signin('akjsdfj@gmail.com', 'agggggd');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@gmail.com', 'mypassword');
    const user = await service.signin('asdf@gmail.com', 'mypassword');

    expect(user).toBeDefined();
  });
});
