import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  userEmail: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column({ nullable: false, select: false, length: 100 })
  userPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    if (this.userPassword) {
      // a senha é codificada usando o algoritmo do pacote bcrypt
      this.userPassword = bcrypt.hashSync(
        this.userPassword,
        bcrypt.genSaltSync(10),
      );
    }
  }

  compare(input: string): Promise<boolean> {
    // a senha fornecida em input é comparada com a senha do registro armazenado no SGBD
    return bcrypt.compare(input, this.userPassword);
  }
}
