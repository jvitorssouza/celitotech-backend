import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUsersTable1731249503298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'roleId',
                        type: 'uuid',
                    },
                    {
                        name: 'accountId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['roleId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'roles',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['accountId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
                onDelete: 'SET NULL',
            }),
        );
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('users');
        
        const foreignKeyRole = table.foreignKeys.find((fk) => fk.columnNames.indexOf('roleId') !== -1);
        if (foreignKeyRole) {
            await queryRunner.dropForeignKey('users', foreignKeyRole);
        }

        const foreignKeyAccount = table.foreignKeys.find((fk) => fk.columnNames.indexOf('accountId') !== -1);
        if (foreignKeyAccount) {
            await queryRunner.dropForeignKey('users', foreignKeyAccount);
        }

        await queryRunner.dropTable('users');
    }

}
