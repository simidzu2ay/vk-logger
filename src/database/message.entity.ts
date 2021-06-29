import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { Attachment } from './attachment.entity';

@Entity()
@Unique(['converstationMessageId'])
export class Message {
    @PrimaryColumn()
    id: number;

    @Column()
    converstationMessageId: number;

    @Column()
    fromId: number;

    @Column({ nullable: true })
    text: string;

    @Column()
    peerId: number;

    replyToId: number;

    @OneToMany(() => Message, m => m.replyTo, { nullable: true })
    replies: Message[];

    @ManyToOne(() => Message, m => m.replies, { nullable: true })
    @JoinColumn({ name: 'replyTo' })
    replyTo: Message;

    @OneToMany(() => Attachment, a => a.message)
    attachments: Attachment[];

    @Column({ default: false })
    isDeleted: boolean;
}
