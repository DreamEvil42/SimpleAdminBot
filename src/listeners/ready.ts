import { Client, Events } from 'discord.js';
import { Commands } from '../Commands.js';
import { Logger } from '../services/logging.service.js';
import { ScheduledService } from '../services/scheduled.service.js';

export default (client: Client): void => {
    client.once(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);

        Logger.log(`${client.user.username} is online`);

        ScheduledService.start(client);
    });
};