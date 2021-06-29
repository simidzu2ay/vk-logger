import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Message } from './message.entity';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    text: string;

    @ManyToOne(() => Message)
    message: Message;

    @OneToMany(() => Attachment, a => a.history, { cascade: true })
    attachments: Attachment[];
}
