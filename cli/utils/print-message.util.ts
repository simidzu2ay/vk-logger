import { prettyMessageObjectUtil } from './pretty-message-object.util';
import { prettyAttachment } from './pretty-attachment';

export const prettyMessageUtil = (message: ReturnType<typeof prettyMessageObjectUtil>, offset = 0): string => {
    const reply = message.replyTo
        ? prettyMessageUtil(prettyMessageObjectUtil(message.replyTo), offset + 2).replace(
              /\n/g,
              `\n${' '.repeat(offset + 2)}`
          )
        : undefined;

    const attachments = message.attachments?.map(a => prettyAttachment(a, offset + 2)).join('');

    return `
        🆔 ID: ${message.id}
        📄 Text: ${message.text}
        👨 From: ${message.fromId}
        🚫 Deleted: ${message.isDeleted}
        🏢 Peer: ${message.peerId}
        ⏰ Date: ${message.date}
        ${reply ? `💬 Reply: ${reply}\n` : ''}
        ${attachments ? `🌆 Attachments: ${attachments}` : ''}
    `
        .replace(/^ {8}/gm, '')
        .replace(/^\s+$/gm, '');
};
