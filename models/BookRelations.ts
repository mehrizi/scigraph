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
  OneToOne,
} from "typeorm";
import { Book } from "./Book";
export type BookRelationType = "node" | "vertice";

@Entity("books_relations")
export class BookRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "enum", enum: ["node", "vertice"] })
  model: BookRelationType;

  @Column({ type: "int" })
  modelId: number;

  @OneToOne(() => Book)
  @JoinColumn()
  book: Book;
}
