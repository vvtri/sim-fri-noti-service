import { MigrationInterface, QueryRunner } from "typeorm";

export class ChnageDbStructure1687008196925 implements MigrationInterface {
    name = 'ChnageDbStructure1687008196925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`truncate noti cascade;`)
        await queryRunner.query(`truncate noti_template cascade;`)
        await queryRunner.query(`DROP INDEX "public"."IDX_e487193247859da8143b90f8b3"`);
        await queryRunner.query(`ALTER TABLE "noti_template" RENAME COLUMN "type" TO "noti_type"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_type_enum" RENAME TO "noti_template_noti_type_enum"`);
        await queryRunner.query(`ALTER TABLE "noti" DROP COLUMN "template_type"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_noti_type_enum" RENAME TO "noti_template_noti_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_noti_type_enum" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "noti_type" TYPE "public"."noti_template_noti_type_enum" USING "noti_type"::"text"::"public"."noti_template_noti_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_noti_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum" RENAME TO "noti_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum" USING "type"::"text"::"public"."noti_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_33c139283ed4e1274cef7106f2" ON "noti_template" ("noti_type", "lang") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad93f6a278d777a8045dfb26df" ON "noti" ("resource_id", "type", "user_id") WHERE deleted_at is null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ad93f6a278d777a8045dfb26df"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33c139283ed4e1274cef7106f2"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum_old" AS ENUM('COMMENT', 'REACTION')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum_old" USING "type"::"text"::"public"."noti_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum_old" RENAME TO "noti_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_noti_type_enum_old" AS ENUM('COMMENT', 'REPLY_COMMENT', 'MENTION', 'REACTION')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "noti_type" TYPE "public"."noti_template_noti_type_enum_old" USING "noti_type"::"text"::"public"."noti_template_noti_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_noti_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_noti_type_enum_old" RENAME TO "noti_template_noti_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_type_enum" AS ENUM('COMMENT', 'REPLY_COMMENT', 'MENTION', 'REACTION')`);
        await queryRunner.query(`ALTER TABLE "noti" ADD "template_type" "public"."noti_template_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_noti_type_enum" RENAME TO "noti_template_type_enum"`);
        await queryRunner.query(`ALTER TABLE "noti_template" RENAME COLUMN "noti_type" TO "type"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e487193247859da8143b90f8b3" ON "noti_template" ("type", "lang") WHERE (deleted_at IS NULL)`);
    }

}
