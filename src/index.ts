import { vk } from './consts';
import 'reflect-metadata';
import { Logger, LogLevel } from './classes/logger.class';
import { attachmentRepository, messagesRepository } from './database';
import { getAttachments } from './utils/get-attachments.util';

Logger.setLevel(process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.ALL);

vk.updates.on('message_new', async (context, next) => {
    try {
        await next();
    } catch (e) {
        Logger.error(e);
    }
});

vk.updates.on('message_new', async context => {
    const attachments = getAttachments(context.attachments);

    const message = messagesRepository.create({
        attachments,
        id: context.id,
        fromId: context.senderId,
        text: context.text,
        replyTo: context.replyMessage?.id,
        peerId: context.peerId
    });

    await messagesRepository.save(message);
    await attachmentRepository.save(
        attachments.map(a => {
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
