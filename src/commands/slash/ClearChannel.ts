import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    GuildTextBasedChannel,
    Locale,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import moment from 'moment';
import { DoResult } from '../../helpers/results.js';
import { Logger } from '../../services/logging.service.js';
import { SupportedLocale, Translate } from '../../services/translate.service.js';
import { SlashCommand } from '../../types/commands.js';

const ClearChannelId = 'ClearChannelId';

export const ClearChannel: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear-channel')
        .setDescription(Translate.getTranslation(Locale.EnglishGB, 'clear-channel-description'))
        .setDescriptionLocalization(Locale.German, Translate.getTranslation(Locale.German, 'clear-channel-description'))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    customId: ClearChannelId,
    ephemeral: true,
    async run(client, interaction) {
        const locale = interaction.locale === Locale.German ? Locale.German : Locale.EnglishGB;

        const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({
                customId: `${ClearChannelId}_${ButtonAction.Clear}_${locale}`,
                label: Translate.getTranslation(locale, 'confirm-button'),
                style: ButtonStyle.Danger,
            }),
            new ButtonBuilder({
                customId: `${ClearChannelId}_${ButtonAction.Cancel}_${locale}`,
                label: Translate.getTranslation(locale, 'cancel-button'),
                style: ButtonStyle.Secondary,
            }),
        ).toJSON();

        await DoResult.OkResult(interaction, {
            title: Translate.getTranslation(locale, 'confirm-title'),
            description: Translate.getTranslation(locale, 'confirm-description'),
            components: [components]
        });
    },
    async buttonResponse(interaction, [action, sLocale]) {
        const locale = sLocale as SupportedLocale;
        if (action === ButtonAction.Cancel) {
            await DoResult.OkUpdate(interaction, {
                title: Translate.getTranslation(locale, 'dismissed-title'),
                description: Translate.getTranslation(locale, 'dismissed-description'),
                components: [],
            });
        }
        if (action === ButtonAction.Clear) {
            const channel = (await interaction.client.channels.fetch(interaction.channelId)) as GuildTextBasedChannel;
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
                    Logger.log(`Bulk deleting ${messages.size} messages`);
                    await channel.bulkDelete(messages, true);
                }
                keepGoing = messages.size === (limit - pinnedMessages) && pinnedMessages < limit;
            }

            messages = (await channel.messages.fetch({ limit: pinnedMessages + 1 }));

            if (messages!.size > pinnedMessages) {
                await DoResult.OkUpdate(interaction, {
                    title: Translate.getTranslation(locale, 'partial-title'),
                    description: Translate.getTranslation(locale, 'partial-description'),
                    components: [],
                });

                const shortLimit = 30;
                messages = await channel.messages.fetch({ limit: shortLimit });
                while (messages.size > pinnedMessages) {
                    pinnedMessages = messages.reduce((acc, msg) => msg.pinned ? acc + 1 : acc, 0);
                    messages = messages.filter(m => !m.pinned);
                    Logger.log(`Deleting ${messages.size} older messages.`);
                    const promises = messages.map(message => channel.messages.delete(message));
                    await Promise.all(promises);
                    messages = await channel.messages.fetch({ limit: shortLimit });
                }
            } else {
                await DoResult.OkUpdate(interaction, {
                    title: Translate.getTranslation(locale, 'fully-deleted-title'),
                    description: Translate.getTranslation(locale, 'fully-deleted-description'),
                    components: [],
                });
            }
        }
    },
};

enum ButtonAction {
    Clear = "Clear",
    Cancel = "Cancel"
}