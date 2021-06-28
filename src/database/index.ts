import { cfg } from 'config';
import { createConnection, Repository } from 'typeorm';
import { Message } from './message.entity';

export let messagesRepository!: Repository<Message>;

createConnection({
    database: cfg.database.name,
    type: 'postgres',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migration/**/*.migration.js'],
    synchronize: process.env.NODE_ENV === 'production' ? false : true,
    cache: cfg.database.cache,
    host: cfg.database.host,
    port: cfg.database.port,
    username: cfg.database.username,
    password: cfg.database.password
})
.then(connection => {
    messagesRepository = connection.getRepository(Message);
})
.catch(e => {
    throw e;
});
