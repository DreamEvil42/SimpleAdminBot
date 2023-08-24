import {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
} from 'discord.js';

export interface BaseCommand {
    ephemeral?: boolean;
    skipInitialReply?: boolean;
    customId?: string;
    modal?: (interaction: ModalSubmitInteraction, additionalInfo?: string[]) => void;
    buttonResponse?: (interaction: ButtonInteraction, additionalInfo: string[]) => void;
}

export interface SlashCommand extends BaseCommand {
    command: Partial<SlashCommandBuilder>,
    run: (client: Client, interaction: ChatInputCommandInteraction) => void;
    autocomplete?: (interaction: AutocompleteInteraction) => void;
    selectMenu?: (interaction: AnySelectMenuInteraction) => void;
}

export interface ContextCommand extends BaseCommand {
    command: Partial<ContextMenuCommandBuilder>;
    run: (client: Client, interaction: ContextMenuCommandInteraction) => void;
}