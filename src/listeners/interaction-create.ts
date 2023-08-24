import {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandInteraction,
    Events,
    Interaction,
    ModalSubmitInteraction,
} from 'discord.js';
import { ContextCommands, SlashCommands } from '../Commands.js';
import { Logger } from '../services/logging.service.js';
import { BaseCommand } from '../types/commands.js';

export default (client: Client): void => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
        if (interaction.isContextMenuCommand()) {
            await handleContextCommand(client, interaction);
        }
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        }
        if (interaction.isAutocomplete()) {
            await handleAutoComplete(interaction);
        }
        if (interaction.isAnySelectMenu()) {
            await handleSelectMenu(interaction);
        }
        if (interaction.isModalSubmit()) {
            await handleModalSubmit(interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const slashCommand = SlashCommands.find(c => c.command.name === interaction.commandName);

    if (!slashCommand) {
        interaction.followUp({ content: 'An error has occurred' });
        return;
    }

    if (!slashCommand.skipInitialReply) {
        await interaction.deferReply({ ephemeral: slashCommand.ephemeral });
    }

    slashCommand.run(client, interaction);
};

const handleContextCommand = async (client: Client, interaction: ContextMenuCommandInteraction): Promise<void> => {
    const contextCommand = ContextCommands.find(c => c.command.name === interaction.commandName);

    if (!contextCommand) {
        interaction.followUp({ content: 'An error has occurred' });
        return;
    }

    if (!contextCommand.skipInitialReply) {
        await interaction.deferReply({ ephemeral: contextCommand.ephemeral });
    }

    contextCommand.run(client, interaction);
};

const handleAutoComplete = async (interaction: AutocompleteInteraction): Promise<void> => {
    const command = SlashCommands.find(c => c.command.name === interaction.commandName);

    if (!command?.autocomplete) {
        Logger.error('Autocomplete command not found:', interaction.commandName);
        return;
    }

    command.autocomplete(interaction);
}

const handleSelectMenu = async (interaction: AnySelectMenuInteraction): Promise<void> => {
    const command = SlashCommands.find(c => c.customId === interaction.customId);

    if (!command?.selectMenu) {
        Logger.error('SelectMenu command not found:', interaction.customId);
        return;
    }

    command.selectMenu(interaction);
};

const handleModalSubmit = async (interaction: ModalSubmitInteraction): Promise<void> => {
    const [customId, ...additionalInfo] = interaction.customId.split('_');
    const command = (SlashCommands as BaseCommand[]).concat(ContextCommands).find(c => c.customId === customId);

    if (!command?.modal) {
        Logger.error('Modal could not be found:', customId);
        return;
    }

    command.modal(interaction, additionalInfo);
};

const handleButtonInteraction = async (interaction: ButtonInteraction): Promise<void> => {
    const [customId, ...additionalInfo] = interaction.customId.split('_');
    const command = (SlashCommands as BaseCommand[]).concat(ContextCommands).find(c => c.customId === customId);

    if (!command?.buttonResponse) {
        Logger.error('No button response handler:', customId);
        return;
    }

    command.buttonResponse(interaction, additionalInfo);
}