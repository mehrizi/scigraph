import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Subject } from './Subject';

@Entity("books")
export class Book extends BaseEntity {
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
    wikiLink: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    amazonLink: string;

    @Column({ type: "int", default: 1000 })
    readEstimate: number;

    @Column({ type: "date", nullable: true })
    publishDate: string;

    @Column({ type: "text" })
    writers: string;

    @Column({ type: "int", default: 0 })
    pageCount: number;

    @ManyToMany(() => Subject, subject => subject.books)
    @JoinTable()
    subjects: Subject[];
}