import { Message } from '../../dist/database/message.entity';
import { AES, enc } from 'crypto-js';
import { cfg } from '../../dist/config';

export const prettyMessageObjectUtil = (message: Message) => {
    return {
        ...message,
        date: message.date.toLocaleString('ru-RU'),
        text: message.text ? AES.decrypt(message.text, cfg.encryption).toString(enc.Utf8) : ''
    };
};
