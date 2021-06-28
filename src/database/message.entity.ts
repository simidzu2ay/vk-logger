import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryColumn()
    id: number;

    @Column()
    fromId: number;

    @Column()
    text: string;
}
