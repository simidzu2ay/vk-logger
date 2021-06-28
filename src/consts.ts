import { cfg } from './config';
import { VK } from 'vk-io';

export const vk = new VK({
    token: cfg.vk.token,
    apiHeaders: {
        'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.102 Safari/537.36'
    },
    apiBaseUrl: cfg.vk.baseUrl ? cfg.vk.baseUrl : 'https://api.vk.com/method/' 
});
