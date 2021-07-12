import { Attachment } from '../../dist/database/attachment.entity';
import { AES, enc } from 'crypto-js';
import { cfg } from '../../dist/config';

export const prettyAttachment = (attachment: Attachment, offset = 0) => {
    return `
        🐢 Type: ${attachment.type}
        🔗 Link: ${AES.decrypt(attachment.url, cfg.encryption).toString(enc.Utf8)}
    `
        .replace(/^ {8}/gm, '')
        .replace(/\n/gm, `\n${' '.repeat(offset)}`);
};
