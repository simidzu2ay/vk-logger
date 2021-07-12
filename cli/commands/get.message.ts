import { Argument, Command, Option } from 'commander';
import { FindManyOptions, In } from 'typeorm';
import Table from 'cli-table3';
import { AES, enc } from 'crypto-js';
import { parseIntArrayUtil, parseIntUtil } from '../utils/parse-int.util';
import { messagesRepository } from '../../dist/database';
import { cfg } from '../../dist/config';
import { Message } from '../../dist/database/message.entity';
import WordWrap from 'wordwrap';

const wrap = WordWrap(72, {
    mode: 'hard'
});

export const getMessage = new Command('messages')
    .addArgument(new Argument('[ids...]', 'Message ids').argParser(parseIntArrayUtil))
    .addOption(new Option('-c, --count <number>').default(10).argParser<number>(parseIntUtil))
    .addOption(new Option('-o, --offset <number>').default(0).argParser<number>(parseIntUtil))
    .addOption(new Option('-p, --peer <number...>', 'Peer Ids').argParser<number[]>(parseIntArrayUtil))
    .addOption(new Option('--cid <number...>', 'Conversation message ids').argParser<number[]>(parseIntArrayUtil))
    .addOption(new Option('-f, --from <number...>', 'User Ids').argParser<number[]>(parseIntArrayUtil))
    .addOption(new Option('--last', 'Get last messages').default(false))
    .addOption(new Option('-d, --deleted', 'Get only deleted messages').default(false))
    .action(async (ids, commandOptions) => {
        let messages: Message[] | null;
        const relations = ['attachments', 'replyTo', 'forwards'];

        if (ids.length)
            messages = await messagesRepository.find({
                where: {
                    id: In(ids)
                },
                relations
            });
        else {
            if (process.env.NODE_ENV === 'dev') console.log(commandOptions);

            const options: FindManyOptions<Message> = {
                relations,
                take: commandOptions.count,
                skip: commandOptions.offset,
                where: {},
                order: {
                    id: commandOptions.last ? 'ASC' : 'DESC'
                }
            };

            if (commandOptions?.deleted)
                options.where = {
                    ...(options.where as {}),
                    isDeleted: true
                };

            if (commandOptions?.peer)
                options.where = {
                    ...(options.where as {}),
                    peerId: In(commandOptions.peer)
                };

            if (commandOptions?.from)
                options.where = {
                    ...(options.where as {}),
                    fromId: In(commandOptions.from)
                };

            if (commandOptions?.cid) {
                if (!commandOptions.peer?.length) throw new Error('No peerId');

                options.where = {
                    ...(options.where as {}),
                    fromId: In(commandOptions.from)
                };
            }

            messages = await messagesRepository.find(options);
        }

        if (messages?.length) {
            const table = new Table({
                head: ['id', 'fromId', 'text', 'peerId', 'date', 'del', 'has']
            });

            const tMessages = messages.map(m => {
                const has: string[] = [];

                if (m.replyTo) has.push('reply');
                if (m.attachments.length) has.push('attachments');
                if (m.forwards.length) has.push('forwards');

                return {
                    ...m,
                    text: m.text ? AES.decrypt(m.text, cfg.encryption).toString(enc.Utf8) : '',
                    date: m.date.toLocaleString('ru-RU'),
                    has
                };
            });

            table.push(
                ...tMessages.map(m => [
                    m.id,
                    m.fromId,
                    wrap(m.text),
                    m.peerId,
                    m.date,
                    m.isDeleted,
                    m.has.length ? m.has.join('|') : 'none'
                ])
            );

            return console.log(table.toString());
        } else throw new Error('No messages found');
    });
