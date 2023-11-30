import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import { ClearChannel } from './commands/slash/ClearChannel.js';
import { ClearChannelScheduled } from './commands/slash/ClearChannelScheduled.js';
import { ClearChannelScheduledList } from './commands/slash/ClearChannelScheduledList.js';
import { ClearChannelScheduledRemove } from './commands/slash/ClearChannelScheduledRemove.js';
import { ClearNumber } from './commands/slash/ClearNumber.js';
import { Ping } from './commands/slash/Ping.js';
import { Stop } from './commands/slash/Stop.js';
import { ContextCommand, SlashCommand } from './types/commands.js';

export const SlashCommands: SlashCommand[] = [
    Ping, Stop, ClearChannel, ClearNumber,
    ClearChannelScheduled, ClearChannelScheduledList, ClearChannelScheduledRemove,
];
// Limit of FIVE maximum
export const ContextCommands: ContextCommand[] = [];
export const Commands = SlashCommands.map(c => c.command) as (SlashCommandBuilder | ContextMenuCommandBuilder)[];
Commands.push(...ContextCommands.map(c => c.command) as ContextMenuCommandBuilder[]);