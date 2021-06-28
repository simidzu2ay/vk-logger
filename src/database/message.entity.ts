import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Attachment } from './attachment.entity';

@Entity()
export class Message {
    @PrimaryColumn()
    id: number;

    @Column()
    fromId: number;

    @Column({ nullable: true })
    text: string;

    @Column()
    peerId: number;

    @Column({ nullable: true })
    replyTo: number;

    @OneToMany(() => Attachment, a => a.id)
    attachments: Attachment[];
}
