import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedNotiTemplate1686972253811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.noti_template ("type", template_text, lang) VALUES('COMMENT', '{{{name}}} đã bình luận trên {{{target}}} của bạn.', 'vn'), 
        ('COMMENT', '{{{name}}} commented on your {{{target}}}.', 'en');`)
        await queryRunner.query(`INSERT INTO public.noti_template ("type", template_text, lang) VALUES('LIKE', '{{{name}}} likes your {{{target}}}: \"{{content}}".', 'vn'), 
        ('LIKE', '{{{name}}} đã thích {{{target}}} của bạn: "{{content}}".', 'en');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
