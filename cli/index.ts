#!/bin/node

import { createDBConnection } from '../dist/database';
import { program } from 'commander';
import { getMessage } from './commands/get.message';

const main = async () => {
    await createDBConnection();

    program.addCommand(getMessage);

    await program.parseAsync();
};

main().then(() => process.exit());
