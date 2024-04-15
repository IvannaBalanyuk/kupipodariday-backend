import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEntitiesMigration1713180240391 implements MigrationInterface {
  name = 'FixEntitiesMigration1713180240391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "amount" numeric NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "price" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "raised"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "raised" numeric`);
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "amount" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "price" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "raised"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "raised" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "raised"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "raised" numeric`);
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "price" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "amount" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ALTER COLUMN "copied" SET NOT NULL`,
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
