import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import { ClearChannel } from './commands/slash/ClearChannel.js';
import { DeleteMessages } from './commands/slash/DeleteMessages.js';
import { Ping } from './commands/slash/Ping.js';
import { Stop } from './commands/slash/Stop.js';
import { ContextCommand, SlashCommand } from './types/commands.js';

export const SlashCommands: SlashCommand[] = [
    Ping, Stop, ClearChannel, DeleteMessages,
];
// Limit of FIVE maximum
export const ContextCommands: ContextCommand[] = [];
export const Commands = SlashCommands.map(c => c.command) as (SlashCommandBuilder | ContextMenuCommandBuilder)[];
Commands.push(...ContextCommands.map(c => c.command) as ContextMenuCommandBuilder[]);