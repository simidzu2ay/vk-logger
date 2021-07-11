import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Forward } from './forwards.entity';

@Entity()
export class Message {
    @PrimaryColumn()
    id: number;

    @Column()
    fromId: number;

    @Column()
    conversationMessageId: number;

    @Column({ nullable: true })
    text?: string;

    @Column()
    peerId: number;

    @Column()
    date: Date;

    @OneToMany(() => Message, m => m.replyTo, { nullable: true })
    replies: Message[];

    @ManyToOne(() => Message, m => m.replies, { nullable: true })
    @JoinColumn({ name: 'replyTo' })
    replyTo?: Message;

    @OneToMany(() => Attachment, a => a.message, { cascade: true })
    attachments: Attachment[];

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Forward, f => f.message, { cascade: true })
    forwards: Forward[];
}
