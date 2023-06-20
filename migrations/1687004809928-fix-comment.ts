import { MigrationInterface, QueryRunner } from "typeorm";

export class FixComment1687004809928 implements MigrationInterface {
    name = 'FixComment1687004809928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM noti_template WHERE "type" = 'LIKE';`)
        await queryRunner.query(`DROP INDEX "public"."IDX_e487193247859da8143b90f8b3"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_type_enum" RENAME TO "noti_template_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_type_enum" AS ENUM('COMMENT', 'REPLY_COMMENT', 'MENTION', 'REACTION')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "type" TYPE "public"."noti_template_type_enum" USING "type"::"text"::"public"."noti_template_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum" RENAME TO "noti_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum" AS ENUM('COMMENT', 'REACTION')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum" USING "type"::"text"::"public"."noti_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "template_type" TYPE "public"."noti_template_type_enum" USING "template_type"::"text"::"public"."noti_template_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_type_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e487193247859da8143b90f8b3" ON "noti_template" ("type", "lang") WHERE deleted_at is null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e487193247859da8143b90f8b3"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_type_enum_old" AS ENUM('COMMENT', 'MENTION', 'LIKE')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "template_type" TYPE "public"."noti_template_type_enum_old" USING "template_type"::"text"::"public"."noti_template_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_type_enum_old" RENAME TO "noti_template_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum_old" AS ENUM('COMMENT', 'LIKE')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum_old" USING "type"::"text"::"public"."noti_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum_old" RENAME TO "noti_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_type_enum_old" AS ENUM('COMMENT', 'MENTION', 'LIKE')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "type" TYPE "public"."noti_template_type_enum_old" USING "type"::"text"::"public"."noti_template_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_type_enum_old" RENAME TO "noti_template_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e487193247859da8143b90f8b3" ON "noti_template" ("type", "lang") WHERE (deleted_at IS NULL)`);
    }

}
