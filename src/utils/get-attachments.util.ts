import { attachmentRepository } from '../database';
import { Attachment, AttachmentType, ExternalAttachment } from 'vk-io';
import { Attachment as DAttachment } from '../database/attachment.entity';
import { Logger } from '../classes/logger.class';

export const getAttachments = (attachments: (Attachment<{}, string> | ExternalAttachment<{}, string>)[]) => {
    let attach: DAttachment[] = [];

    for (const attachment of attachments) {
        const att = attachmentRepository.create({});

        switch (attachment.type as AttachmentType) {
            case AttachmentType.PHOTO:
                att.type = AttachmentType.PHOTO;
                break;
            default:
                Logger.warn('Неизвестный тип вложения', attachment);
        }

        if (att.type) attach.push(att);
    }

    return attach;
};
