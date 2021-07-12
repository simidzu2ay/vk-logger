import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { Logger } from '../classes/logger.class';
import { Message } from './message.entity';
import { Attachment } from './attachment.entity';
import { History } from './history.entity';
import { Forward } from './forwards.entity';
import { dbCfg } from '../config';

export let messagesRepository!: Repository<Message>;
export let attachmentRepository!: Repository<Attachment>;
export let historyRepository!: Repository<History>;
export let forwardRepository!: Repository<Forward>;

export const createDBConnection = () =>
    createConnection({
        ...dbCfg,
        entities: [Message, Attachment, History, Forward]
    } as ConnectionOptions)
        .then(connection => {
            messagesRepository = connection.getRepository(Message);
            attachmentRepository = connection.getRepository(Attachment);
            historyRepository = connection.getRepository(History);
            forwardRepository = connection.getRepository(Forward);
        })
        .catch(e => {
            Logger.error('Ошибка при подключении к базе данных', e);
            process.exit();
        });
