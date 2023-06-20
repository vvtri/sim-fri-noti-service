import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadAtCol1686974271807 implements MigrationInterface {
    name = 'AddReadAtCol1686974271807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" ADD "read_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" DROP COLUMN "read_at"`);
    }

}
