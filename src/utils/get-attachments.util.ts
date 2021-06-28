import { attachmentRepository } from '../database';
import { AttachmentType } from 'vk-io';
import { Attachment as DAttachment } from '../database/attachment.entity';
import { Logger } from '../classes/logger.class';
import { MessagesMessageAttachment } from 'vk-io/lib/api/schemas/objects';

export const getAttachments = (attachments: MessagesMessageAttachment[]) => {
    let attach: DAttachment[] = [];

    for (const attachment of attachments) {
        const att = attachmentRepository.create({});

        switch (attachment.type as AttachmentType) {
            case AttachmentType.PHOTO:
                att.type = AttachmentType.PHOTO;
                att.url = attachment.photo.sizes[attachment.photo.sizes.length - 1].url;
                break;
            case AttachmentType.VIDEO:
                att.type = AttachmentType.VIDEO;
                att.url = `https://vk.com/video${attachment.video.owner_id}_${attachment.video.id}_${attachment.video.access_key}`;
                break;
            default:
                Logger.warn('Неизвестный тип вложения', attachment);
        }

        if (att.type) attach.push(att);
    }

    return attach;
};
