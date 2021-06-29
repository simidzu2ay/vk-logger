import { cfg } from './config';
import { VK } from 'vk-io';
import { Logger } from './classes/logger.class';

export const vk = new VK({
    token: cfg.vk.token,
    apiHeaders: {
        'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.102 Safari/537.36'
    },
    apiBaseUrl: cfg.vk.baseUrl ? cfg.vk.baseUrl : 'https://api.vk.com/method/'
});

export let userId!: number;
vk.api.users
    .get({})
    .then(ans => {
        const [user] = ans;
        userId = user.id;
        Logger.info(`Пользователь: ${user.first_name} ${user.last_name}`);
    })
    .catch(e => {
        throw e;
    });
