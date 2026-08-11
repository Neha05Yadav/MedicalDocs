CREATE TABLE IF NOT EXISTS management_notification_read (
  userId VARCHAR(191) NOT NULL,
  notificationKey VARCHAR(255) NOT NULL,
  readAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (userId, notificationKey),
  CONSTRAINT management_notification_read_user_fkey
    FOREIGN KEY (userId) REFERENCES user(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
