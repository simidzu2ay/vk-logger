import { AES } from 'crypto-js';
import { userId, vk } from './consts';
import { Logger, LogLevel } from './classes/logger.class';
import { attachmentRepository, createDBConnection, historyRepository, messagesRepository } from './database';
import { getAttachments } from './utils/get-attachments.util';
import { Attachment } from './database/attachment.entity';
import { Forward } from './database/forwards.entity';
import { getForwards } from './utils/get-forwards.util';
import { saveForwards } from './utils/save-forwards.util';
import 'reflect-metadata';
import { cfg } from './config';

createDBConnection().then(() => Logger.info('Успешное подключение к базе данных'));

Logger.setLevel(process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.ALL);

// @ts-ignore
vk.updates.on(['message_new', 'message_flags', 'message_edit'], async (context, next) => {
    const senderId = context.senderId ? context.senderId : context.message?.senderId;
    const peerId = context.peerId ? context.peerId : context.message?.peerId;

    if (cfg.ignore.user.includes(senderId)) return;
    if (cfg.ignore.peer.includes(peerId)) return;
    if (cfg.ignore.fromGroup && (senderId < 0 || peerId < 0)) return;

    try {
        await next();
    } catch (e) {
        Logger.error(e);
    }
});

vk.updates.on('message_new', async context => {
    const attachments: Attachment[] = [];
    const forwards: Forward[] = [];

    if (context.attachments.length || context.hasForwards) {
        const obj = await vk.api.messages.getById({
            message_ids: context.id
        });

        const msg = obj.items[0];

        attachments.push(...getAttachments(msg.attachments ? msg.attachments : []));
        forwards.push(...getForwards(msg.fwd_messages ? msg.fwd_messages : []));
    }

    const replyTo = await messagesRepository.findOne({
        where: {
            peerId: context.peerId,
            conversationMessageId: context.replyMessage?.conversationMessageId
        }
    });

    const text = context.text ? AES.encrypt(context.text, cfg.encryption).toString() : undefined;

    const message = messagesRepository.create({
        text,
        replyTo,
        attachments,
        id: context.id,
        peerId: context.peerId,
        date: new Date(context.createdAt * 1000),
        fromId: context.isOutbox ? userId : context.senderId,
        conversationMessageId: context.conversationMessageId
    });

    await messagesRepository.save(message);
    await saveForwards(
        forwards.map(f => {
            f.message = message;
            return f;
        })
    );
});

vk.updates.on('message_flags', async context => {
    const message = await messagesRepository.findOne(context.id);

    if (!message) return Logger.warn('Удаление сообщения которого нет в БД, игнорирую');

    message.isDeleted = context.isDeletedForAll;
    await messagesRepository.save(message);
});

vk.updates.on('message_edit', async context => {
    const message = await messagesRepository.findOne(context.id);
    if (!message) return Logger.warn('Изменение сообщения которого нет в БД, игнорирую');

    const text = context.text ? AES.encrypt(context.text, cfg.encryption).toString() : undefined;

    const history = historyRepository.create({
        text,
        message
    });

    const attachments: Attachment[] = [];

    if (context.attachments.length) {
        const msg = await vk.api.messages.getById({
            message_ids: context.id
        });
        attachments.push(...getAttachments(msg.items[0].attachments ? msg.items[0].attachments : []));
    }

    await historyRepository.save(history);
    await attachmentRepository.save(
        attachments.map(a => {
            a.history = history;
            a.message = message;
            return a;
        })
    );
});

vk.updates
    .start()
    .then(() => {
        Logger.info('Логгер успешно запущен');
    })
    .catch(Logger.error);
