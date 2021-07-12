import { readFileSync } from 'fs';
import path from 'path';

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

export const cfg: Config = JSON.parse(readFileSync(path.join(__dirname, '..', 'config', 'main.json'), 'utf-8'));
export const dbCfg = JSON.parse(readFileSync(path.join(__dirname, '..', 'ormconfig.json'), 'utf-8'));
