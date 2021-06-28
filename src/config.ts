import { readFileSync } from 'fs';
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';

export interface VKConfig {
    token: string;
    baseUrl: string;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    cache: BaseConnectionOptions['cache'] | boolean;
}

export interface Config {
    database: DatabaseConfig;
    vk: VKConfig;
}

export const cfg: Config = JSON.parse(readFileSync('./config/main.json', 'utf-8'));
