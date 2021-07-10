import { readFileSync } from 'fs';

export interface VKConfig {
    token: string;
    baseUrl: string;
}

export interface Config {
    vk: VKConfig;
    encryption: string;
}

export const cfg: Config = JSON.parse(readFileSync('./config/main.json', 'utf-8'));
