import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "amount",
            type: "int",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "url_cover",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "branch_id",
            type: "uuid",
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
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
