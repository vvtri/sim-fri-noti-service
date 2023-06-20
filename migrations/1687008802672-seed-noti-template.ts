import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedNotiTemplate1687008802672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.noti_template (noti_type, template_text, lang) VALUES
        ('COMMENT_POST', '{{{name}}} commented on your post.', 'en'),
        ('COMMENT_POST', '{{{name}}} đã bình luận trên bài viết của bạn.', 'vn'),
        ('POST_REACTION', '{{{name}}} {{react}} your post: "{{content}}".', 'en'),
        ('POST_REACTION', '{{{name}}} {{react}} bài viết của bạn: "{{content}}"', 'vn'),
        ('COMMENT_REACTION', '{{{name}}} {{react}} your comment: "{{content}}".', 'en'),
        ('COMMENT_REACTION', '{{{name}}} {{react}} bình luận của bạn: "{{content}}"', 'vn'),
        ('REPLY_COMMENT', '{{{name}}} replies to your comment.', 'en'),
        ('REPLY_COMMENT', '{{{name}}} đã phản hồi bình luận của bạn.', 'vn');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
