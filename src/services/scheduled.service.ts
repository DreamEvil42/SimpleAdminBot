import { Channel, Client, GuildTextBasedChannel } from 'discord.js';
import moment from 'moment';
import { DatabaseService } from '../data/database.service.js';
import { PromiseHelper } from '../helpers/promise-helper.js';
import { Logger } from './logging.service.js';

export const ScheduledService = {
    client: null as Client | null,
    start(client: Client) {
        this.client = client;

        const nextCheck = moment().endOf('hour');
        const diff = nextCheck.valueOf() - Date.now();
        
        // Run now
        this.runDeleteCheck();

        // Run at end of current hour
        setTimeout(() => {
            this.runDeleteCheck();
            
            // Run every hour after that
            setInterval(() => this.runDeleteCheck(), 60 * 60_000);
        }, diff);
    },
    async runDeleteCheck() {
        if (!this.client) return;

        const allSchedules = await DatabaseService.getAllClearChannelFrequencies();

        const channelIds = new Set<string>();
        allSchedules.forEach(schedule => {
            if (schedule.nextDelete < Date.now() + 5_000) {
                channelIds.add(schedule.channelId);
            }
        });

        const channelResults = await Promise.allSettled(Array.from(channelIds).map(channelId => this.client?.channels.fetch(channelId)));
        
        const channels = [] as Channel[];
        channelResults.forEach(result => {
            if (PromiseHelper.isFulfilled(result) && result.value) {
                channels.push(result.value);
            }
        });

        channelIds.forEach(channelId => {
            if (!channels.find(channel => channel.id === channelId)) {
                DatabaseService.deleteClearChannelFrequency(channelId);
            }
        });

        channels.forEach(async channel => {
            if (!channel || !channel.isTextBased()) return;
            channel = channel as GuildTextBasedChannel;

            const limit = 100;
            let messages;
            let pinnedMessages = 0;
            let keepGoing = true;
            while (keepGoing) {
                messages = (await channel.messages.fetch({ limit }));
                const twoWeeksAgo = moment().subtract(2, 'weeks').add(10, 'seconds');
                messages = messages.filter(m => moment(m.createdTimestamp).isAfter(twoWeeksAgo));
                pinnedMessages = messages.reduce((acc, msg) => msg.pinned ? acc + 1 : acc, 0);
                messages = messages.filter(m => !m.pinned);
                if (messages.size > 0) {
                    Logger.log(`Bulk deleting ${messages.size} messages from #${channel.name}`);
                    await channel.bulkDelete(messages, true);
                }
                keepGoing = messages.size === (limit - pinnedMessages) && pinnedMessages < limit;
            }

            messages = (await channel.messages.fetch({ limit: pinnedMessages + 1 }));

            if (messages!.size > pinnedMessages) {
                const shortLimit = 30;
                messages = await channel.messages.fetch({ limit: shortLimit });
                while (messages.size > pinnedMessages) {
                    pinnedMessages = messages.reduce((acc, msg) => msg.pinned ? acc + 1 : acc, 0);
                    messages = messages.filter(m => !m.pinned);
                    Logger.log(`Deleting ${messages.size} older messages from #${channel.name}.`);
                    const promises = messages.map(message => {
                        channel = channel as GuildTextBasedChannel;
                        return channel.messages.delete(message);
                    });
                    await Promise.allSettled(promises);
                    messages = await channel.messages.fetch({ limit: shortLimit });
                }
            }

            let { frequency, nextDelete } = allSchedules.find(sched => sched.channelId === channel?.id)!;
            while (nextDelete < Date.now()) {
                nextDelete += frequency * 24 * 60 * 60_000;
            }
            
            await DatabaseService.updateClearChannelFrequency(channel!.guildId, channel!.id, nextDelete);
        });
    },
};