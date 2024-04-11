import { MigrationInterface, QueryRunner } from 'typeorm';

export class UuidMigration1712809851797 implements MigrationInterface {
  name = 'UuidMigration1712809851797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_e8100751be1076656606ae045e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "PK_57c6ae1abe49201919ef68de900"`,
    );
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "offer" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "itemId"`);
    await queryRunner.query(`ALTER TABLE "offer" ADD "itemId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "FK_d976be560c304e5396c50bd72c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "PK_e338d8f62014703650439326d3a"`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "wish" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_e686abff4343ad90ca53a7fc122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_acf92a9b67b36657847695751ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "PK_620bff4a240d66c357b5d820eaa"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "wishlist" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_20a447bbd8b2e0c58b420300d4d" PRIMARY KEY ("wishId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e686abff4343ad90ca53a7fc12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP COLUMN "wishlistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD "wishlistId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0" PRIMARY KEY ("wishId", "wishlistId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_e686abff4343ad90ca53a7fc122" PRIMARY KEY ("wishlistId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20a447bbd8b2e0c58b420300d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP COLUMN "wishId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD "wishId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_e686abff4343ad90ca53a7fc122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0" PRIMARY KEY ("wishlistId", "wishId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e686abff4343ad90ca53a7fc12" ON "wishlist_items_wish" ("wishlistId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20a447bbd8b2e0c58b420300d4" ON "wishlist_items_wish" ("wishId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_e8100751be1076656606ae045e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0" FOREIGN KEY ("itemId") REFERENCES "wish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "FK_d976be560c304e5396c50bd72c4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_acf92a9b67b36657847695751ba" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_e686abff4343ad90ca53a7fc122" FOREIGN KEY ("wishlistId") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d" FOREIGN KEY ("wishId") REFERENCES "wish"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_e686abff4343ad90ca53a7fc122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_acf92a9b67b36657847695751ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "FK_d976be560c304e5396c50bd72c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_e8100751be1076656606ae045e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20a447bbd8b2e0c58b420300d4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e686abff4343ad90ca53a7fc12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_e686abff4343ad90ca53a7fc122" PRIMARY KEY ("wishlistId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP COLUMN "wishId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD "wishId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20a447bbd8b2e0c58b420300d4" ON "wishlist_items_wish" ("wishId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_e686abff4343ad90ca53a7fc122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0" PRIMARY KEY ("wishId", "wishlistId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_20a447bbd8b2e0c58b420300d4d" PRIMARY KEY ("wishId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP COLUMN "wishlistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD "wishlistId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e686abff4343ad90ca53a7fc12" ON "wishlist_items_wish" ("wishlistId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "PK_20a447bbd8b2e0c58b420300d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0" PRIMARY KEY ("wishlistId", "wishId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "wishlist" ADD "ownerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "PK_620bff4a240d66c357b5d820eaa"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "wishlist" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_acf92a9b67b36657847695751ba" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_e686abff4343ad90ca53a7fc122" FOREIGN KEY ("wishlistId") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "ownerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "PK_e338d8f62014703650439326d3a"`,
    );
    await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "wish" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "FK_d976be560c304e5396c50bd72c4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d" FOREIGN KEY ("wishId") REFERENCES "wish"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "itemId"`);
    await queryRunner.query(`ALTER TABLE "offer" ADD "itemId" integer`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "offer" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "PK_57c6ae1abe49201919ef68de900"`,
    );
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "offer" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0" FOREIGN KEY ("itemId") REFERENCES "wish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_e8100751be1076656606ae045e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
