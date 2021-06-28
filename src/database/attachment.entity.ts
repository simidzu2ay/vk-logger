import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttachmentType } from 'vk-io';
import { Message } from './message.entity';

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: AttachmentType
    })
    type: AttachmentType;

    @ManyToOne(() => Message, m => m.attachments, {
        cascade: true
    })
    message: Message;
}
