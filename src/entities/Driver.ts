import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Movement } from "./Movement"; 

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 30, nullable: false })
  license_number: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  full_address: string;

  @OneToOne(() => User, (user) => user.driver)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Movement, (movement) => movement.driver) 
  movements: Movement[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}