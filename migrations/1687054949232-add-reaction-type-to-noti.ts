import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReactionTypeToNoti1687054949232 implements MigrationInterface {
    name = 'AddReactionTypeToNoti1687054949232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" ADD "reaction_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "noti" DROP COLUMN "reaction_type"`);
    }

}
