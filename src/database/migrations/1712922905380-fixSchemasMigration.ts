import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSchemasMigration1712922905380 implements MigrationInterface {
  name = 'FixSchemasMigration1712922905380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d" FOREIGN KEY ("wishId") REFERENCES "wish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d" FOREIGN KEY ("wishId") REFERENCES "wish"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
