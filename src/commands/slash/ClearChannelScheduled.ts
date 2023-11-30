import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import { DatabaseService } from '../../data/database.service.js';
import { DoResult } from '../../helpers/results.js';
import { SupportedLocale, Translate } from '../../services/translate.service.js';
import { SlashCommand } from '../../types/commands.js';

const ClearChannelScheduledId = 'ClearChannelScheduledId';

export const ClearChannelScheduled: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear-channel-scheduled')
        .setDescription(Translate.getTranslation(Locale.EnglishGB, 'clear-channel-scheduled-description'))
        .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'clear-channel-scheduled-description'))
        .addIntegerOption(o => o
            .setName('days')
            .setDescription(Translate.getTranslation(Locale.EnglishGB, 'days-description'))
            .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'days-description'))
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true))
        .addIntegerOption(o => o
            .setName('hour-of-day')
            .setDescription(Translate.getTranslation(Locale.EnglishGB, 'hour-description'))
            .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'hour-description'))
            .setMinValue(0)
            .setMaxValue(24)
            .setRequired(true))
        .addStringOption(o => o
            .setName('timezone')
            .setDescription(Translate.getTranslation(Locale.EnglishGB, 'timezone-description'))
            .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'timezone-description'))
            .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    ephemeral: true,
    customId: ClearChannelScheduledId,
    async run(client, interaction) {
        if (!interaction.inGuild()) return;

        const locale = interaction.locale === Locale.German ? Locale.German : Locale.EnglishGB;
        const frequency = interaction.options.getInteger('days', true);
        const hours = interaction.options.getInteger('hour-of-day', true);
        const timezone = interaction.options.getString('timezone', true);

        if (!timezone.match(/^(\+|-)?(0|1)?((?<=1)[0-4]|(?<!1)[0-9])[0-5][0-9]$/)) {
            await DoResult.ErrorResult(interaction, {
                title: Translate.getTranslation(locale, 'timezone-error-title'),
                description: Translate.getTranslation(locale, 'timezone-error-description'),
            });
            return;
        }

        try {
            await client.channels.fetch(interaction.channelId);
        } catch {
            await DoResult.ErrorResult(interaction, {
                title: Translate.getTranslation(locale, 'invalid-channel-title'),
                description: Translate.getTranslation(locale, 'invalid-channel-description', `<@${client.user?.id}>`),
            });
            return;
        }

        const date = moment().set('hours', +hours).set('minutes', 0).set('seconds', 0).utcOffset(timezone, true);
        if (date.isBefore(Date.now())) {
            date.add(1, 'day');
        }
        const seconds = Math.floor(date.valueOf() / 1000);

        const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({
                customId: `${ClearChannelScheduledId}_${ButtonAction.Confirm}_${locale}_${date.valueOf()}_${frequency}`,
                label: Translate.getTranslation(locale, 'confirm-button'),
                style: ButtonStyle.Danger,
            }),
            new ButtonBuilder({
                customId: `${ClearChannelScheduledId}_${ButtonAction.Cancel}_${locale}`,
                label: Translate.getTranslation(locale, 'cancel-button'),
                style: ButtonStyle.Secondary,
            }),
        ).toJSON();

        await DoResult.OkResult(interaction, {
            title: Translate.getTranslation(locale, 'confirm-title'),
            description: Translate.getTranslation(locale, 'confirm-scheduled-description', `<t:${seconds}>`, `${frequency}`),
            components: [components],
        });
    },
    async buttonResponse(interaction, [action, sLocale, nextDelete, frequency]) {
        if (!interaction.inGuild()) return;

        const locale = sLocale as SupportedLocale;
        if (action === ButtonAction.Cancel) {
            await DoResult.OkUpdate(interaction, {
                title: Translate.getTranslation(locale, 'dismissed-title'),
                description: Translate.getTranslation(locale, 'dismissed-description'),
                components: [],
            });
        }
        if (action === ButtonAction.Confirm) {
            await DatabaseService.setClearChannelFrequency(interaction.guildId, interaction.channelId, +frequency, +nextDelete);
            const seconds = Math.floor(+nextDelete / 1000);
            await DoResult.OkUpdate(interaction, {
                title: Translate.getTranslation(locale, 'scheduled-confirmed-title'),
                description: Translate.getTranslation(locale, 'scheduled-confirmed-description', `<t:${seconds}>`, `${frequency}`),
                components: [],
            });
        }
    },
};

enum ButtonAction {
    Confirm = 'Confirm',
    Cancel = 'Cancel'
}