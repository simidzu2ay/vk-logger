import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Message } from './message.entity';

@Entity()
export class Forward {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Forward, f => f.forwards, { cascade: true })
    @JoinColumn({ name: 'forwardTo' })
    forwardTo: Forward;

    @OneToMany(() => Forward, f => f.forwardTo)
    forwards: Forward[];

    @ManyToOne(() => Message, m => m.forwards, { nullable: true })
    @JoinColumn()
    message?: Message;

    @Column({ nullable: true })
    text?: string;

    @Column()
    fromId: number;

    @OneToMany(() => Attachment, a => a.forward, { cascade: true })
    attachments: Attachment[];
}
