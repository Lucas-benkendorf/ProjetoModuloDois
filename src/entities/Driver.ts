import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  full_address: string;

  @Column({ type: "varchar", length: 30, nullable: false })
  document: string;

  @OneToOne(() => User, (user) => user.driver)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
