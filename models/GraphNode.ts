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
export class GraphNode extends BaseEntity {
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

  @Column({ type: "float", default: 0 })
  weight: number;

  @Column({ type: "int", default: 0 })
  color: number;

  @Column({ type: "int", default: 1 })
  level: number;

  @Column({ type: "int", nullable: true })
  issn1: number | null;

  @Column({ type: "bigint", nullable: true })
  srcid: number | null;

  // Self-referential relationship for parent node
  @ManyToOne(() => GraphNode, (node) => node.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parentId" })
  parent: GraphNode;

  @Column({ type: "float", default: 0 })
  x: number;

  @Column({ type: "float", default: 0 })
  y: number;
  // parentId: number;

  // Inverse side of the parent relationship
  @OneToMany(() => GraphNode, (node) => node.parent)
  children: GraphNode[];

  @ManyToMany(() => Book)
  @JoinTable()
  books: Book[];

  async countChildren(): Promise<number> {
    return await GraphNode.count({ where: { parent: this } });
  }
}
