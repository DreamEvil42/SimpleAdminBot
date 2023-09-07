import { channel } from 'diagnostics_channel';
import { GuildTextBasedChannel, Locale, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import { DoResult } from '../../helpers/results.js';
import { Logger } from '../../services/logging.service.js';
import { Translate } from '../../services/translate.service.js';
import { SlashCommand } from '../../types/commands.js';

export const DeleteMessages: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear-number')
        .setDescription(Translate.getTranslation(Locale.EnglishGB, 'delete-messages-description'))
        .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'delete-messages-description'))
        .addIntegerOption(o => o
            .setName('count')
            .setDescription(Translate.getTranslation(Locale.EnglishGB, 'count-description'))
            .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'count-description'))
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    ephemeral: true,
    async run(client, interaction) {
        const locale = interaction.locale === Locale.German ? Locale.German : Locale.EnglishGB;
        let remainingCount = interaction.options.getInteger('count', true);
        const channel = (await interaction.client.channels.fetch(interaction.channelId)) as GuildTextBasedChannel;

        let limit;
        let messages;
        let keepGoing = true;
        while (keepGoing) {
            limit = Math.min(100, remainingCount);
            messages = (await channel.messages.fetch({ limit }));
            const twoWeeksAgo = moment().subtract(2, 'weeks').add(10, 'seconds');
            messages = messages.filter(m => moment(m.createdTimestamp).isAfter(twoWeeksAgo));
            Logger.log(`Bulk deleting ${messages.size} messages`);
            remainingCount -= messages.size;
            await channel.bulkDelete(messages);
            keepGoing = remainingCount > 0 && messages.size === limit;
        }

        limit = Math.max(1, remainingCount);
        messages = (await channel.messages.fetch({ limit }));
        if (!messages.size)
            remainingCount = 0;


        if (remainingCount) {
            await DoResult.OkResult(interaction, {
                title: Translate.getTranslation(locale, 'partial-title'),
                description: Translate.getTranslation(locale, 'partial-description'),
            });

            while(remainingCount > 0 && messages.size > 0) {
                limit = Math.min(20, remainingCount);
                messages = await channel.messages.fetch({ limit });
                Logger.log(`Deleting ${messages.size} messages`);
                remainingCount -= messages.size;
                const promises = messages.map(message => channel.messages.delete(message));
                await Promise.all(promises);
            }

            await DoResult.EditReply(interaction, {
                title: Translate.getTranslation(locale, 'delete-complete-title'),
                description: Translate.getTranslation(locale, 'delete-complete-description'),
            });
        } else {
            await DoResult.OkResult(interaction, {
                title: Translate.getTranslation(locale, 'delete-complete-title'),
                description: Translate.getTranslation(locale, 'delete-complete-description'),
            });
        }
    },
};