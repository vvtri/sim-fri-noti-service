import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotiFriend1687591413735 implements MigrationInterface {
    name = 'AddNotiFriend1687591413735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_33c139283ed4e1274cef7106f2"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_noti_type_enum" RENAME TO "noti_template_noti_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_noti_type_enum" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT', 'NEW_FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "noti_type" TYPE "public"."noti_template_noti_type_enum" USING "noti_type"::"text"::"public"."noti_template_noti_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_noti_type_enum_old"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad93f6a278d777a8045dfb26df"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum" RENAME TO "noti_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT', 'NEW_FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum" USING "type"::"text"::"public"."noti_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_33c139283ed4e1274cef7106f2" ON "noti_template" ("noti_type", "lang") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad93f6a278d777a8045dfb26df" ON "noti" ("resource_id", "type", "user_id") WHERE deleted_at is null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ad93f6a278d777a8045dfb26df"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33c139283ed4e1274cef7106f2"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum_old" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT')`);
        await queryRunner.query(`ALTER TABLE "noti" ALTER COLUMN "type" TYPE "public"."noti_type_enum_old" USING "type"::"text"::"public"."noti_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_type_enum_old" RENAME TO "noti_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad93f6a278d777a8045dfb26df" ON "noti" ("type", "user_id", "resource_id") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_noti_type_enum_old" AS ENUM('POST_REACTION', 'COMMENT_POST', 'COMMENT_REACTION', 'REPLY_COMMENT')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ALTER COLUMN "noti_type" TYPE "public"."noti_template_noti_type_enum_old" USING "noti_type"::"text"::"public"."noti_template_noti_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_noti_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."noti_template_noti_type_enum_old" RENAME TO "noti_template_noti_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_33c139283ed4e1274cef7106f2" ON "noti_template" ("noti_type", "lang") WHERE (deleted_at IS NULL)`);
    }

}
