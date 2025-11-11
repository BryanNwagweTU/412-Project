CREATE TABLE `messages`
(
	`messageID` INT NOT NULL,
	`message` VARCHAR(200) NULL,
	`userID` INT NOT NULL,
	`userName` VARCHAR(45) NOT NULL,
	`timestamp` DATETIME NOT NULL,
	`chatID` INT NOT NULL,
	PRIMARY KEY (`messageID`)
	CONSTRAINT `chat_id`
		FOREIGN KEY(`chatID`)
		REFERENCES `chatrooms`
		ON DELETE NO ACTION,
		ON UPDATE NO ACTION,
);

CREATE TABLE `reports`
(
	`reportID` INT NOT NULL,
	`userID` INT NOT NULL,
	`reportedUserID` INT NOT NULL,
	`reason` VARCHAR(200) NULL,
	`messageID` INT NOT NULL,
	PRIMARY KEY (`reportID`)
	CONSTRAINT `user_id`
		FOREIGN KEY(`userID`)
		REFERENCES `messages` (`userID`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `reported_user_id`
		FOREIGN KEY (`reportedUserID`)
		REFERENCES `messages` (`userID`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
	CONSTRAINT `reported_message`
		FOREIGN KEY (`messageID`)
		REFERENCES `messages` (`messageID`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE `users`
(
	`userID` INT NOT NULL,
	`userName` VARCHAR(45) NOT NULL,
	`email` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`userID`)
);

CREATE TABLE `chatrooms`
(
	`chatID` INT NOT NULL,
	`courseNum` INT NOT NULL,
	`courseName` VARCHAR(100) NOT NULL,
	PRIMARY KEY(`chatID`)
);