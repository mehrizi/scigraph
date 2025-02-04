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
  size: number;

  @Column({ type: "int" })
  node1: number;

  @Column({ type: "int" })
  node2: number;

  key:string
  source:number
  target: number
  attributes: any
}
