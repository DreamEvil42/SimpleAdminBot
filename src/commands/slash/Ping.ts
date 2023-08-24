import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { DoResult } from '../../helpers/results.js';
import { SlashCommand } from '../../types/commands.js';

export const Ping: SlashCommand = {
    command: new SlashCommandBuilder().setName('ping').setDescription('Returns the dicord-to-bot lag time'),
    ephemeral: true,
    skipInitialReply: true,
    async run(client: Client, interaction: ChatInputCommandInteraction) {
        const start = Date.now();
        await interaction.deferReply({ ephemeral: true });
        const diff = Date.now() - start;

        await DoResult.OkResult(interaction, { title: 'Pong 🏓', description:`Took ${diff}ms` });
    }
};