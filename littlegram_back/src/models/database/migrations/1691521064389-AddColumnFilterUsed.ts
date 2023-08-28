import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnFilterUsed1691521064389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('posts', [
      new TableColumn({
        name: 'filter_used',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'filter_used');
  }
}
