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

@Entity("nodes")
export class Node extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  wikilink: string;

  @Column({ type: "int", default: 0 })
  size: number;

  // Self-referential relationship for parent node
  @ManyToOne(() => Node, (node) => node.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parent_id" })
  parent: Node;

  // Inverse side of the parent relationship
  @OneToMany(() => Node, (node) => node.parent)
  children: Node[];

  @ManyToMany(() => Book, (book) => book.nodes, {})
  @JoinTable()
  books: Book[];


}
