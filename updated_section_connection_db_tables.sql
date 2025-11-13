DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    userName VARCHAR(45) NOT NULL
);


CREATE TABLE messages (
    messageID SERIAL PRIMARY KEY,
    userID INT NOT NULL REFERENCES users(userID),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    message VARCHAR(200),
    chatID INT NOT NULL
);


CREATE TABLE reports (
    reportID SERIAL PRIMARY KEY,
    userID INT NOT NULL REFERENCES users(userID),
    reportedUserID INT NOT NULL REFERENCES users(userID),
    messageID INT NOT NULL REFERENCES messages(messageID),
    reason VARCHAR(200)
);
