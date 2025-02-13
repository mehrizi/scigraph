import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("edges")
export class GraphEdge extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float" })
  weight: number;

  @Column({ type: "int" })
  node1: number;

  @Column({ type: "int" })
  node2: number;
  }
