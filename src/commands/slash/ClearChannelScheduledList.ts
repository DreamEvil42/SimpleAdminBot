import { EmbedBuilder, GuildBasedChannel, Locale, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { DatabaseService } from '../../data/database.service.js';
import { DoResult } from '../../helpers/results.js';
import { Translate } from '../../services/translate.service.js';
import { SlashCommand } from '../../types/commands.js';

export const ClearChannelScheduledList: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear-channel-scheduled-list')
        .setDescription(Translate.getTranslation(Locale.EnglishGB, 'clear-channel-scheduled-list-description'))
        .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'clear-channel-scheduled-list-description'))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    ephemeral: true,
    async run(client, interaction) {
        if (!interaction.inGuild()) return;

        const locale = interaction.locale === Locale.German ? Locale.German : Locale.EnglishGB;

        const allScheduled = await DatabaseService.getAllClearChannelFrequenciesForGuild(interaction.guildId);
        const promises = allScheduled.map(schedule => interaction.guild?.channels.fetch(schedule.channelId));
        const channels = await Promise.all(promises);
        const channelDict = {} as Record<string, GuildBasedChannel>;
        channels.forEach(chan => !!chan && (channelDict[chan.id] = chan));

        if (allScheduled.length) {
            const embeds = allScheduled.map(schedule => {
                const lastDeleted = schedule.lastDelete
                    ? `<t:${Math.floor(schedule.lastDelete / 1000)}>`
                    : '-';
                const nextDelete = `<t:${Math.floor(schedule.nextDelete / 1000)}>`;
                return new EmbedBuilder()
                    .setTitle(channelDict[schedule.channelId].name)
                    .addFields([
                        { name: Translate.getTranslation(locale, 'frequency'), value: `${schedule.frequency} ${Translate.getTranslation(locale, 'days')}`, inline: true },
                        { name: Translate.getTranslation(locale, 'last-cleared'), value: lastDeleted, inline: true },
                        { name: Translate.getTranslation(locale, 'next-clear'), value: nextDelete, inline: true },
                    ])
                    .toJSON();
            });
    
            await DoResult.OkResultFromEmbedList(interaction, embeds);
        } else {
            await DoResult.OkResult(interaction, {
                title: Translate.getTranslation(locale, 'nothing-scheduled-title'),
                description: Translate.getTranslation(locale, 'nothing-scheduled-description'),
            });
        }
    },
}