import { readFileSync } from 'fs';

export interface IgnoreConfig {
    peer: number[];
    user: number[];
    fromGroup: true;
}

export interface VKConfig {
    token: string;
    baseUrl: string;
}

export interface Config {
    vk: VKConfig;
    encryption: string;
    ignore: IgnoreConfig;
}

export const cfg: Config = JSON.parse(readFileSync('./config/main.json', 'utf-8'));
