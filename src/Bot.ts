import { Client } from 'discord.js';
import { DatabaseService } from './data/database.service.js';
import interactionCreate from './listeners/interaction-create.js';
import ready from './listeners/ready.js';
import { Logger } from './services/logging.service.js';
import { BotId } from './types/constants.js';

const token = BotId;

Logger.log('Bot is starting...');

const client = new Client({ intents: [] });

ready(client);
interactionCreate(client);
DatabaseService.migrate().then(() => {
    Logger.log('Migration completed.');
});

client.login(token);
