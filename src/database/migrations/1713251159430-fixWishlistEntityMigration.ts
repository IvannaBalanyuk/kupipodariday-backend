import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixWishlistEntityMigration1713251159430
  implements MigrationInterface
{
  name = 'FixWishlistEntityMigration1713251159430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist" ALTER COLUMN "description" SET DEFAULT 'Описание отсутствует'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ALTER COLUMN "description" SET DEFAULT 'Описание отсутствует'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist" ALTER COLUMN "description" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ALTER COLUMN "description" DROP DEFAULT`,
    );
  }
}
