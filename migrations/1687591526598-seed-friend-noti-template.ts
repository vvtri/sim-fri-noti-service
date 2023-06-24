import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedFriendNotiTemplate1687591526598 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.noti_template (noti_type, template_text, lang) VALUES ('NEW_FRIEND_REQUEST', '{{{name}}} sent you a friend request.', 'en'), ('NEW_FRIEND_REQUEST', '{{{name}}} đã gửi bạn lời mời kết bạn.', 'vn'), ('FRIEND_REQUEST_ACCEPTED', '{{{name}}} accepted your friend request.', 'en'), ('FRIEND_REQUEST_ACCEPTED', '{{{name}}} đã chấp nhận lời mời kết bạn.', 'vn');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
