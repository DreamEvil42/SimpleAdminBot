CREATE TABLE clear_channel_frequency (
    guildId TEXT NOT NULL,
    channelId TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    lastDelete INTEGER NULL,
    nextDelete INTEGER NOT NULL,
    PRIMARY KEY (guildId, channelId)
);