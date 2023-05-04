import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './auth.credential';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  createUser = async (authCredentialDto: AuthCredentialsDto): Promise<void> => {
    const { username, password } = authCredentialDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  };
}
