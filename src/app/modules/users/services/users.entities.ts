import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public uid: string;
  @Column()
  public name: string;
  @Column()
  public surname: string;
  @Column()
  public email: string;
  @Column({ type: 'varchar' })
  public password: string;
}
