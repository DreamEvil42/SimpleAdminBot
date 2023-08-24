import { Locale } from 'discord.js';

export type SupportedLocale = Locale.EnglishGB | Locale.German;
type Translations = Record<SupportedLocale, Record<string, string>>;

export const Translate = {
    getTranslation(locale: SupportedLocale, key: string) {
        return TranslationDict[locale][key] ?? TranslationDict[Locale.EnglishGB][key];
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
        'delete-complete-description': 'Die gewünschten Nachrichten wurden erfolgreich gelöscht.'
    },
};