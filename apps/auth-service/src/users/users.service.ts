import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDTO } from '@app/common';
import { PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly logger: PinoLogger,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
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
      throw new UnauthorizedException();
    }

    const isPass = await find.compare(data.userPassword);

    if (!isPass) {
      throw new UnauthorizedException();
    }

    return {
      id: find.id,
      userEmail: find.userEmail,
    };
  }

  async create(data: CreateUserDto) {
    const newUser = this.repository.create({
      userEmail: data.userEmail,
      userName: data.userName,
      userPassword: '',
    });

    const save = await this.repository.save(newUser);

    return { save };
  }
}
