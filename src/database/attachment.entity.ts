import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttachmentType } from 'vk-io';
import { Message } from './message.entity';
import { History } from './history.entity';

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: AttachmentType
    })
    type: AttachmentType;

    @Column()
    url: string;

    @ManyToOne(() => Message, m => m.attachments)
    @JoinColumn()
    message: Message;

    @ManyToOne(() => History, h => h.attachments, { nullable: true })
    @JoinColumn()
    history: History;
}
