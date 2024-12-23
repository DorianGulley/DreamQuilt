CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE users
ADD CONSTRAINT unique_username UNIQUE (username);
SELECT *
FROM users