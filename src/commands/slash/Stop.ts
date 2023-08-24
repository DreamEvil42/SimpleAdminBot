import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { DoResult } from '../../helpers/results.js';
import { SlashCommand } from '../../types/commands.js';

export const Stop: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('stop').setDescription('Kills everything -- Restricted to Dream')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    ephemeral: true,
    async run(client: Client, interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== '442904668285304833') {
            await DoResult.ErrorResult(interaction, { description: 'This command is not available because you are not Dream' });
            return;
        }
        await DoResult.OkResult(interaction, { description: 'Shutting down' });
        process.exit();
    },
}