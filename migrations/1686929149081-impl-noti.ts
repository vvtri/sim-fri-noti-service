import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplNoti1686929149081 implements MigrationInterface {
    name = 'ImplNoti1686929149081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."noti_template_type_enum" AS ENUM('COMMENT', 'MENTION')`);
        await queryRunner.query(`CREATE TABLE "noti_template" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "type" "public"."noti_template_type_enum" NOT NULL, "template_text" character varying, "lang" character varying NOT NULL, CONSTRAINT "PK_5b4b2c6885f44b22f4245582903" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."noti_type_enum" AS ENUM('COMMENT', 'MENTION')`);
        await queryRunner.query(`CREATE TABLE "noti" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "type" "public"."noti_type_enum" NOT NULL, "params" jsonb, "link" character varying, "sender_type" character varying, "user_id" integer NOT NULL, "sender_user_id" integer, "template_type" integer NOT NULL, CONSTRAINT "PK_7cf9e0268bd8efdae59dc122f99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."file_file_type_enum" RENAME TO "file_file_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."file_file_type_enum" AS ENUM('png', 'jpg', 'jpeg', 'pdf', 'mp3', 'mp4', 'wav', 'xlsx', 'xls', 'csv', 'unknown')`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "file_type" TYPE "public"."file_file_type_enum" USING "file_type"::"text"::"public"."file_file_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_file_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "noti" ADD CONSTRAINT "FK_e590c01f01723d011bae6e78e7e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "noti" ADD CONSTRAINT "FK_e200e4de95ac7b5f3ee5fc1bcde" FOREIGN KEY ("sender_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" DROP CONSTRAINT "FK_e200e4de95ac7b5f3ee5fc1bcde"`);
        await queryRunner.query(`ALTER TABLE "noti" DROP CONSTRAINT "FK_e590c01f01723d011bae6e78e7e"`);
        await queryRunner.query(`CREATE TYPE "public"."file_file_type_enum_old" AS ENUM('png', 'jpg', 'jpeg', 'pdf', 'mp3', 'mp4', 'wav', 'xlsx', 'xls', 'csv')`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "file_type" TYPE "public"."file_file_type_enum_old" USING "file_type"::"text"::"public"."file_file_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."file_file_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."file_file_type_enum_old" RENAME TO "file_file_type_enum"`);
        await queryRunner.query(`DROP TABLE "noti"`);
        await queryRunner.query(`DROP TYPE "public"."noti_type_enum"`);
        await queryRunner.query(`DROP TABLE "noti_template"`);
        await queryRunner.query(`DROP TYPE "public"."noti_template_type_enum"`);
    }

}
