import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Book } from "./Book";

@Entity("vertices")
export class Vertice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float" })
  weight: number;

  @Column({ type: "int" })
  node1: number;

  @Column({ type: "int" })
  node2: number;

}
