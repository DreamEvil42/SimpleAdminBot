import { Locale, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { DatabaseService } from '../../data/database.service.js';
import { DoResult } from '../../helpers/results.js';
import { Translate } from '../../services/translate.service.js';
import { SlashCommand } from '../../types/commands.js';

export const ClearChannelScheduledRemove: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear-channel-scheduled-remove')
        .setDescription(Translate.getTranslation(Locale.EnglishGB, 'clear-channel-scheduled-remove-description'))
        .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'clear-channel-scheduled-remove-description'))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption(o => o
            .setName('channel')
            .setDescription(Translate.getTranslation(Locale.EnglishGB, 'channel-description'))
            .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'channel-description'))
            .setRequired(true)),
    ephemeral: true,
    async run(client, interaction) {
        if (!interaction.inGuild()) return;

        const locale = interaction.locale === Locale.German ? Locale.German : Locale.EnglishGB;
        const channel = interaction.options.getChannel('channel', true);

        const deleted = await DatabaseService.deleteClearChannelFrequency(channel.id, interaction.guildId)

        if (deleted) {
            await DoResult.OkResult(interaction, {
                title: Translate.getTranslation(locale, 'scheduled-remove-success-title'),
                description: Translate.getTranslation(locale, 'scheduled-remove-success-description', channel.id),
            });
        } else {
            await DoResult.ErrorResult(interaction, {
                title: Translate.getTranslation(locale, 'scheduled-remove-fail-title'),
                description: Translate.getTranslation(locale, 'scheduled-remove-fail-description', channel.id),
            });
        }
    },
};