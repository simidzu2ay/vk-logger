import { forwardRepository } from '../database';
import { Forward } from '../database/forwards.entity';
import { MessagesForeignMessage } from 'vk-io/lib/api/schemas/objects';
import { getAttachments } from './get-attachments.util';
import { AES } from 'crypto-js';
import { cfg } from '../config';

export const getForwards = (forwards: MessagesForeignMessage[], forwardTo?: Forward) => {
    const fwd: Forward[] = [];

    for (const forward of forwards) {
        const f = forwardRepository.create({
            forwardTo,
            attachments: forward.attachments ? getAttachments(forward.attachments) : [],
            fromId: forward.from_id,
            text: forward.text ? AES.encrypt(forward.text, cfg.encryption).toString() : undefined
        });

        f.forwards = getForwards(forward.fwd_messages ? forward.fwd_messages : [], f);
        fwd.push(f);
    }

    return fwd;
};
