import { attachmentRepository } from '../database';
import { AttachmentType } from 'vk-io';
import { Attachment as DAttachment } from '../database/attachment.entity';
import { Logger } from '../classes/logger.class';
import { MessagesMessageAttachment } from 'vk-io/lib/api/schemas/objects';

export const getAttachments = (attachments: MessagesMessageAttachment[]) => {
    let attach: DAttachment[] = [];

    for (const { type, ...obj } of attachments) {
        const att = attachmentRepository.create({
            type
        });
        const attachment = obj[type];

        switch (type as AttachmentType) {
            case AttachmentType.PHOTO:
                att.url = attachment.sizes[attachment.sizes.length - 1].url;
                break;
            case AttachmentType.AUDIO_MESSAGE:
                att.url = attachment.link_mp3;
                break;
            case AttachmentType.WALL:
                att.url = `https://vk.com/wall${attachment.from_id}_${attachment.id}`;
                break;
            case AttachmentType.MARKET:
                att.url = `https://vk.com/product${attachment.owner_id}_${attachment.id}`;
                break;
            case AttachmentType.VIDEO:
            case AttachmentType.STORY:
            case AttachmentType.POLL:
                att.url = `https://vk.com/${type}${attachment.owner_id}_${attachment.id}`;
                break;
            case AttachmentType.STICKER:
                att.url = attachment.images[attachment.images.length - 1].url;
                break;
            case AttachmentType.AUDIO:
            case AttachmentType.DOCUMENT:
            case AttachmentType.LINK:
            case AttachmentType.DOCUMENT:
            case AttachmentType.GRAFFITI:
                att.url = attachment.url;
                break;
            case AttachmentType.WALL_REPLY:
                att.url = `https://vk.com/wall/${attachment.owner_id}_${attachment.post_id}?reply=${attachment.id}`;
                break;
            case AttachmentType.GIFT:
                att.url = attachment.thumb_256;
                break;
            default:
                Logger.warn('Неизвестный тип вложения', type, attachment);
        }

        if (att.url) attach.push(att);
    }

    return attach;
};
