import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDTO } from '@app/common';
import { PinoLogger } from 'nestjs-pino';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async login(data: LoginUserDTO) {
    const userEmail = data.userEmail;
    const find = await this.repository
      .createQueryBuilder('user')
      .select()
      .addSelect('user.userPassword')
      .where('user.userEmail=:userEmail', { userEmail })
      .getOne();

    if (!find) {
      this.logger.error('Erro ao fazer login, email invalido!');
      throw new RpcException({
        message: 'Dados de login não conferem',
        code: 400,
      });
    }

    const isPass = await find.compare(data.userPassword);

    if (!isPass) {
      this.logger.error('Erro ao fazer login, senha invalida!');
      throw new RpcException({
        message: 'Dados de login não conferem',
        code: 400,
      });
    }

    return {
      id: find.id,
      userEmail: find.userEmail,
    };
  }

  async verifyUserExists(id: number): Promise<boolean> {
    const user = await this.repository.findOneBy({ id: id });
    if (!user) {
      throw new RpcException({
        code: 404,
        message: 'Usuário não encontrado',
      });
    }
    return true;
  }

  async create(data: CreateUserDto) {
    const find = await this.repository.findOneBy({
      userEmail: data.userEmail,
    });

    if (find) {
      this.logger.error('O e-mail fornecido já está em uso.');
      throw new RpcException({
        message: 'O e-mail fornecido já está em uso',
        code: 409,
      });
    }
    const newUser = this.repository.create({
      userEmail: data.userEmail,
      userName: data.userName,
      userPassword: data.userPassword,
    });

    const save = await this.repository.save(newUser);

    return {
      id: save.id,
      userEmail: save.userEmail,
      userName: save.userName,
    };
  }
}
