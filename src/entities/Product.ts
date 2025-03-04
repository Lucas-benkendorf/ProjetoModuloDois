import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Branch } from "./Branch";
import { Movement } from "./Movement"; 

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
  @JoinColumn({ name: "branch_id" })
  branch: Branch;

  @OneToMany(() => Movement, (movement) => movement.product) 
  movements: Movement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}