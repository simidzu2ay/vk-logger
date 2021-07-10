import { createConnection, Repository } from 'typeorm';
import { Logger } from '../classes/logger.class';
import { Message } from './message.entity';
import { Attachment } from './attachment.entity';
import { History } from './history.entity';
import { Forward } from './forwards.entity';

export let messagesRepository!: Repository<Message>;
export let attachmentRepository!: Repository<Attachment>;
export let historyRepository!: Repository<History>;
export let forwardRepository!: Repository<Forward>;

createConnection()
    .then(connection => {
        messagesRepository = connection.getRepository(Message);
        attachmentRepository = connection.getRepository(Attachment);
        historyRepository = connection.getRepository(History);
        forwardRepository = connection.getRepository(Forward);
        Logger.info('Успешное подключение к базе данных');
    })
    .catch(e => {
        Logger.error('Ошибка при подключении к базе данных', e);
        process.exit();
    });
