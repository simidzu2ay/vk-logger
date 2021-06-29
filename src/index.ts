import { userId, vk } from './consts';
import 'reflect-metadata';
import { Logger, LogLevel } from './classes/logger.class';
import { attachmentRepository, messagesRepository } from './database';
import { getAttachments } from './utils/get-attachments.util';
import { Attachment } from './database/attachment.entity';

Logger.setLevel(process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.ALL);

vk.updates.on('message_new', async (context, next) => {
    try {
        await next();
    } catch (e) {
        Logger.error(e);
    }
});

vk.updates.on('message_new', async context => {
    const attachments: Attachment[] = [];

    if (context.attachments.length) {
        const msg = await vk.api.messages.getById({
            message_ids: context.id
        });
        attachments.push(...getAttachments(msg.items[0].attachments ? msg.items[0].attachments : []));
    }

    const replyTo = await messagesRepository.findOne({
        where: {
            peerId: context.peerId,
            converstationMessageId: context.replyMessage?.conversationMessageId
        }
    });

    const message = messagesRepository.create({
        attachments,
        replyTo,
        id: context.id,
        fromId: context.isOutbox ? userId : context.senderId,
        text: context.text,
        peerId: context.peerId,
        converstationMessageId: context.conversationMessageId
    });

    await messagesRepository.save(message);
    await attachmentRepository.save(
        attachments.map(a => {
            a.message = message;
            return a;
        })
    );
});

vk.updates.on('message_flags', async context => {
    const message = await messagesRepository.findOne(context.id);

    if (!message) return;
    if (!context?.isDeletedForAll) return;

    message.isDeleted = true;
    await messagesRepository.save(message);
});

vk.updates
    .start()
    .then(() => {
        Logger.info('Логгер успешно запущен');
    })
    .catch(Logger.error);
