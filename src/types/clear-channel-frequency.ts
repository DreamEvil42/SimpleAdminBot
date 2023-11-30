import { Snowflake } from 'discord.js';

export interface ClearChannelFrequencySetting {
    guildId: Snowflake;
    channelId: Snowflake;
    frequency: number;
    lastDelete: number | null;
    nextDelete: number;
}