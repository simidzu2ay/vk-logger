import { Logger } from '../classes/logger.class';
import { cfg } from '../config';
import { createConnection, Repository } from 'typeorm';
import { Message } from './message.entity';
import { Attachment } from './attachment.entity';

export let messagesRepository!: Repository<Message>;
export let attachmentRepository!: Repository<Attachment>;

createConnection({
    database: cfg.database.name,
    type: 'postgres',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migration/**/*.migration.js'],
    synchronize: process.env.NODE_ENV !== 'production',
    cache: cfg.database.cache,
    host: cfg.database.host,
    port: cfg.database.port,
    username: cfg.database.username,
    password: cfg.database.password
})
    .then(connection => {
        Logger.info('Успешное подключение к базе данных');
        messagesRepository = connection.getRepository(Message);
        attachmentRepository = connection.getRepository(Attachment);
    })
    .catch(e => {
        Logger.error('Ошибка при подключении к базе данных', e);
        process.exit();
    });
