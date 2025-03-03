import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Branch } from "./Branch";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "int" })
  amount: number;

  @Column({ type: "varchar", length: 200 })
  description: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  url_cover?: string;

  @ManyToOne(() => Branch, (branch) => branch.products)
  branch: Branch;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
