import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMovementsTable1712345678901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "movements",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "destination_branch_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "product_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "driver_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "quantity",
            type: "int",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'PENDING'",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["destination_branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "products",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["driver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "drivers",
            onDelete: "SET NULL", 
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("movements");
  }
}