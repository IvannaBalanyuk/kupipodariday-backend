import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEntities2Migration1713181009192 implements MigrationInterface {
  name = 'FixEntities2Migration1713181009192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "amount" numeric NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "price" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "raised"`);
    await queryRunner.query(
      `ALTER TABLE "wish" ADD "raised" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "raised"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "raised" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "price" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "amount" integer NOT NULL`,
    );
  }
}
