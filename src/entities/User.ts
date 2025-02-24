import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Driver } from "./Driver";
import { Branch } from "./Branch";

export enum UserProfile {
  DRIVER = "DRIVER",
  BRANCH = "BRANCH",
  ADMIN = "ADMIN",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: false, default: UserProfile.ADMIN })
  profile: UserProfile;

  @Column({ type: "varchar", length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 150, nullable: false })
  password_hash: string;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @OneToOne(() => Driver, (driver) => driver.user)
  driver: Driver;

  @OneToOne(() => Branch, (branch) => branch.user)
  branch: Branch;
}
