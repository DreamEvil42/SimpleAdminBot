import { Locale } from 'discord.js';

export type SupportedLocale = Locale.EnglishGB | Locale.German;
type Translations = Record<SupportedLocale, Record<string, string>>;

export const Translate = {
    getTranslation(locale: SupportedLocale, key: string, ...values: string[]) {
        let result = TranslationDict[locale][key] ?? TranslationDict[Locale.EnglishGB][key];

        values.forEach(val => result = result.replace('{value}', val));

        return result;
    }
}

const TranslationDict: Translations = {
    'en-GB': {
        'clear-channel-description': 'Clear all messages from this channel',
        'confirm-button': 'Do it!',
        'cancel-button': `Don't do it!`,
        'confirm-title': 'Are you sure?',
        'confirm-description': 'Confirm you want to take this irreversible action.',
        'dismissed-title': 'Alrighty',
        'dismissed-description': 'Messages not deleted.',
        'partial-title': 'Deleting older messages',
        'partial-description': 'Recent messages deleted, older messages may take a while. Deletion may pause several times during this process.',
        'fully-deleted-title': 'They Gone',
        'fully-deleted-description': 'Channel Purged 😈',

        'delete-messages-description': 'Delete a specific number of messages',
        'count-description': 'Number of messages to delete.',
        'delete-complete-title': 'Message deletion completed',
        'delete-complete-description': 'Messages deleted successfully.',

        'clear-channel-scheduled-description': 'Clear all messages from this channel every X days',
        'days-description': 'Number of days between deletes',
        'hour-description': 'The hour of the day to run the delete [0-24]',
        'timezone-description': 'Your timezone e.g. +1000',
        'timezone-error-title': 'Invalid Timezone Value',
        'timezone-error-description': 'Timezone must be full timezone value e.g. +1000 or -0200',
        'confirm-scheduled-description': 'Messages will be deleted at {value} and then every {value} days.',
        'scheduled-confirmed-title': 'Setup Successful',
        'scheduled-confirmed-description': 'Channel will be cleared at {value} and then every {value} days.',
        'invalid-channel-title': 'Invalid Channel',
        'invalid-channel-description': '{value} does not have access to this channel.',

        'clear-channel-scheduled-list-description': 'Show all scheduled clear channel commands',
        'frequency': 'Frequency',
        'days': 'Day(s)',
        'last-cleared': 'Last Cleared',
        'next-clear': 'Next Clear',
        'nothing-scheduled-title': 'Nothing Found',
        'nothing-scheduled-description': 'There are no scheduled clear channel commands',

        'clear-channel-scheduled-remove-description': 'Remove a scheduled clear channel command',
        'channel-description': 'The channel to remove the scheduled clear from',
        'scheduled-remove-success-title': 'Schedule Removed',
        'scheduled-remove-success-description': 'Channel <#{value}> no longer has a clear schedule.',
        'scheduled-remove-fail-title': 'Nothing to Remove',
        'scheduled-remove-fail-description': 'Channel <#{value}> has no clear schedule to remove.',
    },
    'de': {
        'clear-channel-description': 'Alle Nachrichten aus diesem Channel löschen',
        'confirm-button': 'Löschen!',
        'cancel-button': `Doch nicht löschen!`,
        'confirm-title': 'Bist du dir sicher?',
        'confirm-description': 'Du kannst die Nachrichten anschließend nicht mehr wiederherstellen. Trotzdem fortfahren?',
        'dismissed-title': 'Alles klar!',
        'dismissed-description': 'Nachrichten doch nicht gelöscht.',
        'partial-title': 'Ältere Nachrichten werden gelöscht',
        'partial-description': 'Aktuelle Nachrichten bereits gelöscht, ältere befinden sich im Löschvorgang. Löschung pausiert während dieses Vorgangs ab und zu, hab einen Moment Geduld!',
        'fully-deleted-title': 'Weg sind sie',
        'fully-deleted-description': 'Channel Purged 😈',

        'delete-messages-description': 'Lösche eine bestimmte Anzahl an Nachrichten',
        'count-description': 'Anzahl der zu löschenden Nachrichten.',
        'delete-complete-title': 'Löschung erfolgt!',
        'delete-complete-description': 'Die gewünschten Nachrichten wurden erfolgreich gelöscht.',

        'clear-channel-scheduled-description': 'Alle Nachrichten aus diesem Kanal nach X Tagen löschen',
        'days-description': 'Tagesabstände zwischen Löschungen',
        'hour-description': 'Uhrzeit wann gelöscht werden soll [0-24]',
        'timezone-description': 'Deine Zeitzone z.B. +1000',
        'timezone-error-title': 'Ungültige Zeitzonen Eingabe',
        'timezone-error-description': 'Zeitzone muss eine ganze Zahl ergeben z.B. +1000 oder -0200',
        'confirm-scheduled-description': 'Nachrichten werden um {value} gelöscht und ab dann alle {value} Tage.',
        'scheduled-confirmed-title': 'Setup Successful',
        'scheduled-confirmed-description': 'Kanal wird geleert um {value} und dann alle {value} Tage.',
        'invalid-channel-title': 'Ungültiger Kanal',
        'invalid-channel-description': '{value} hat keinen Zugriff auf diesen Kanal.',

        'clear-channel-scheduled-list-description': 'Alle gesetzten Kanal Löschungen anzeigen',
        'frequency': 'Häufigkeit',
        'days': 'Tag(e)',
        'last-cleared': 'Zuletzt Geleert',
        'next-clear': 'Nächste Löschung',
        'nothing-scheduled-title': 'Keine geplanten Löschungen gefunden',
        'nothing-scheduled-description': 'Es gibt keine aktiven Kanal Leerungen',

        'clear-channel-scheduled-remove-description': 'Geplanten Channel Clear zurücknehmen',
        'channel-description': 'Der von der Liste zu entfernende Kanal',
        'scheduled-remove-success-title': 'Geplante Löschung aufgehoben',
        'scheduled-remove-success-description': 'Der Kanal <#{value}> hat nun keine festen Löschungen mehr.',
        'scheduled-remove-fail-title': 'Es gab nichts zu entfernen',
        'scheduled-remove-fail-description': 'Der Kanal <#{value}> konnte nicht von der geplanten Liste an Kanal Leerungen entfernt werden.',
    },
};