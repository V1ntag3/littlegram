import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTablePhotos1690063393470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('photos', [
      new TableColumn({
        name: 'size',
        type: 'integer',
        isNullable: false,
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('photos', 'size');
  }
}
