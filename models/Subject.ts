import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Subject Entity
@Entity()
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 }) // Explicitly define the column type
  name: string;

  @OneToMany(() => SubjectRelation, (relation) => relation.subject1)
  relations: SubjectRelation[];


  @Column({ type: "int", default: 1 })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// SubjectRelation Entity (to establish relationships between subjects)
@Entity()
export class SubjectRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  subject1: number;

  @Column({ type: "int", nullable: false })
  subject2: number;

  @Column({ type: "int", default: 1 })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
