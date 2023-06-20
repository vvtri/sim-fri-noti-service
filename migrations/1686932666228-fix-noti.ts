import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNoti1686932666228 implements MigrationInterface {
    name = 'FixNoti1686932666228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti_template" DROP COLUMN "lang"`);
        await queryRunner.query(`CREATE TYPE "public"."noti_template_lang_enum" AS ENUM('vn', 'en')`);
        await queryRunner.query(`ALTER TABLE "noti_template" ADD "lang" "public"."noti_template_lang_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "noti" DROP COLUMN "template_type"`);
        await queryRunner.query(`ALTER TABLE "noti" ADD "template_type" "public"."noti_template_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" DROP COLUMN "template_type"`);
        await queryRunner.query(`ALTER TABLE "noti" ADD "template_type" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "noti_template" DROP COLUMN "lang"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_lang_enum"`);
        await queryRunner.query(`ALTER TABLE "noti_template" ADD "lang" character varying NOT NULL`);
    }

}
