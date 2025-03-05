import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Branch } from "./Branch";
  import { Product } from "./Product";
  import { Driver } from "./Driver";
  
  export enum MovementStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
  }
  
  @Entity("movements")
  export class Movement {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(() => Branch, (branch) => branch.movements)
    @JoinColumn({ name: "destination_branch_id" })
    destination_branch: Branch;
  
    @ManyToOne(() => Product, (product) => product.movements)
    @JoinColumn({ name: "product_id" })
    product: Product;
  
    @ManyToOne(() => Driver, (driver) => driver.movements, { nullable: true })
    @JoinColumn({ name: "driver_id" })
    driver: Driver | null;
  
    @Column({ type: "int" })
    quantity: number;
  
    @Column({
      type: "enum",
      enum: MovementStatus,
      default: MovementStatus.PENDING,
    })
    status: MovementStatus;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }