import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttachmentType } from 'vk-io';
import { Message } from './message.entity';
import { History } from './history.entity';
import { Forward } from './forwards.entity';

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

    @ManyToOne(() => Message, m => m.attachments, { nullable: true })
    @JoinColumn()
    message?: Message;

    @ManyToOne(() => History, h => h.attachments, { nullable: true })
    @JoinColumn()
    history?: History;

    @ManyToOne(() => Forward, f => f.attachments, { nullable: true })
    forward?: Forward;
}
