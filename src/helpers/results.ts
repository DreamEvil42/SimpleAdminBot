import {
    AnySelectMenuInteraction,
    APIActionRowComponent,
    APIEmbed,
    ButtonInteraction,
    ChatInputCommandInteraction,
    Colors,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
} from 'discord.js';

type ResultInteraction = ChatInputCommandInteraction | ContextMenuCommandInteraction;
type ReplyInteraction = ResultInteraction | AnySelectMenuInteraction | ModalSubmitInteraction | ButtonInteraction;
type UpdateInteraction = AnySelectMenuInteraction | ButtonInteraction;
interface ResponseOptions { title?: string; description: string; userMentions?: string[]; thumbnail?: string | null; }
interface ReplyOptions { ephemeral?: boolean; }
interface ComponentOptions { components?: APIActionRowComponent<any>[]; }

export const DoResult = {
    async OkResult(interaction: ResultInteraction, { description, title, components, userMentions, thumbnail }: ResponseOptions & ComponentOptions) {
        title ??= 'Success';
        await interaction.followUp({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Green,
            }],
            components,
            options: { allowedMentions: { users: userMentions } },
        });
    },
    async OkReply(interaction: ReplyInteraction, { description, title, components, ephemeral, userMentions, thumbnail }: ResponseOptions & ComponentOptions & ReplyOptions) {
        title ??= 'Success';
        ephemeral ??= false;
        await interaction.reply({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Green,
            }],
            components,
            ephemeral,
            options: { allowedMentions: { users: userMentions } },
        });
    },
    async OkUpdate(interaction: UpdateInteraction, { description, title, components, userMentions, thumbnail }: ResponseOptions & ComponentOptions) {
        title ??= 'Success';
        await interaction.update({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Green,
            }],
            components,
            options: { allowedMentions: { users: userMentions } },
        });
    },
    async ErrorResult(interaction: ResultInteraction, { description, title, userMentions, thumbnail }: ResponseOptions) {
        title ??= 'Error';
        await interaction.followUp({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Red,
            }],
            options: { allowedMentions: { users: userMentions } },
        });
    },
    async ErrorReply(interaction: ReplyInteraction, { description, title, ephemeral, userMentions, thumbnail }: ResponseOptions & ReplyOptions) {
        await interaction.reply({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Red,
            }],
            ephemeral,
            options: { allowedMentions: { users: userMentions } },
        });
    },
    async OkResultFromEmbed(interaction: ResultInteraction, embed: APIEmbed) {
        embed.color = Colors.Green;
        await interaction.followUp({ embeds: [embed] });
    },
    async OkReplyFromEmbed(interaction: ResultInteraction, embed: APIEmbed) {
        embed.color = Colors.Green;
        await interaction.reply({ embeds: [embed] });
    },
    async OkResultFromEmbedList(interaction: ResultInteraction, embeds: APIEmbed[]) {
        embeds.forEach(embed => {
            embed.color = Colors.Green;
        });

        await interaction.followUp({ embeds });
    },
    async EditReply(interaction: ReplyInteraction, { description, title, userMentions, thumbnail }: ResponseOptions) {
        return await interaction.editReply({
            embeds: [{
                title,
                description,
                thumbnail: thumbnail ? { url: thumbnail } : void 0,
                color: Colors.Green,
            }],
            options: { allowedMentions: { users: userMentions } },
        });
    },
};