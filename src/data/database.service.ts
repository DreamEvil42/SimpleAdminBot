import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { ClearChannelFrequencySetting } from '../types/clear-channel-frequency.js';
import { DbPath } from '../types/constants.js';

export const DatabaseService = {
    async migrate() {
        const db = await open({
            filename: path.join(DbPath, 'everything.db'),
            driver: sqlite3.Database
        });

        await db.migrate({
            migrationsPath: path.join(DbPath, 'migrations'),
        });

        await db.close();
    },
    async getDb() {
        return await open({
            filename: path.join(DbPath, 'everything.db'),
            driver: sqlite3.Database,
        });
    },
    async getClearChannelFrequency(guildId: string, channelId: string) {
        const db = await this.getDb();

        const setting = await db.get<ClearChannelFrequencySetting>(`SELECT * FROM clear_channel_frequency WHERE guildId = '${guildId}' AND channelId = '${channelId}'`);

        await db.close();

        return setting;
    },
    async getAllClearChannelFrequenciesForGuild(guildId: string) {
        const db = await this.getDb();

        const setting = await db.all<ClearChannelFrequencySetting[]>(`SELECT * FROM clear_channel_frequency WHERE guildId = '${guildId}'`);

        await db.close();

        return setting;
    },
    async getAllClearChannelFrequencies() {
        const db = await this.getDb();

        const setting = await db.all<ClearChannelFrequencySetting[]>(`SELECT * FROM clear_channel_frequency`);

        await db.close();

        return setting;
    },
    async setClearChannelFrequency(guildId: string, channelId: string, frequency: number, nextDelete: number) {
        const db = await this.getDb();

        const sql = `INSERT INTO clear_channel_frequency (guildId, channelId, frequency, nextDelete) VALUES ('${guildId}', '${channelId}', ${frequency}, ${nextDelete})`
            + ' ON CONFLICT (guildId, channelId) DO UPDATE SET frequency = excluded.frequency, nextDelete = excluded.nextDelete';
        await db.run(sql);

        await db.close();
    },
    async updateClearChannelFrequency(guildId: string, channelId: string, nextDelete: number) {
        const db = await this.getDb();

        const res = await db.run(`UPDATE clear_channel_frequency SET lastDelete = ${Date.now()}, nextDelete = ${nextDelete} WHERE guildId = '${guildId}' AND channelId = '${channelId}'`);

        await db.close();
    },
    async deleteClearChannelFrequency(channelId: string, guildId?: string) {
        const db = await this.getDb();

        const res = await db.run(`DELETE FROM clear_channel_frequency WHERE channelId = '${channelId}'` + (guildId ? ` AND guildId = '${guildId}'` : ''));

        await db.close();

        return res.changes;
    },
};