import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDriversTable1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "drivers",
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
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "license_number",
                        type: "varchar",
                        length: "30",
                        isNullable: false,
                    },
                    {
                        name: "full_address",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

       
        await queryRunner.createForeignKey(
            "drivers",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("drivers");
    }
}