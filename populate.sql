INSERT INTO Customer (Customer_ID, Name, Billing_Email, Payment_Method) VALUES
(1, 'Alice Johnson', 'alice@example.com', 'Credit'),
(2, 'Bob Smith', 'bob@example.com', 'Debit'),
(3, 'Charlie Brown', 'charlie@example.com', 'UPI'),
(4, 'David Williams', 'david@example.com', 'PayPal'),
(5, 'Emma Davis', 'emma@example.com', 'Credit'),
(6, 'Frank White', 'frank@example.com', 'Debit'),
(7, 'Grace Lee', 'grace@example.com', 'UPI'),
(8, 'Henry Adams', 'henry@example.com', 'PayPal'),
(9, 'Ivy Clark', 'ivy@example.com', 'Credit'),
(10, 'Jack Turner', 'jack@example.com', 'Debit');

INSERT INTO Publisher (Publisher_ID, License_Number, Type) VALUES
(101, 'LIC123A', 'Company'),
(102, 'LIC456B', 'Individual'),
(103, 'LIC789C', 'Company'),
(104, 'LIC012D', 'Individual'),
(105, 'LIC345E', 'Company'),
(106, 'LIC678F', 'Individual'),
(107, 'LIC901G', 'Company'),
(108, 'LIC234H', 'Individual'),
(109, 'LIC567I', 'Company'),
(110, 'LIC890J', 'Individual');

INSERT INTO Forum (Forum_ID, Title, Type, Description, Analytics) VALUES
(1, 'Game Reviews', 'Customer', 'Discuss and review games.', 100),
(2, 'Publisher Announcements', 'Publisher', 'Latest updates from publishers.', 200),
(3, 'Customer Support', 'Customer', 'Support and troubleshooting.', 150),
(4, 'Game Development', 'Publisher', 'Insights on game development.', 180),
(5, 'Gaming Strategies', 'Customer', 'Tips and tricks for gamers.', 120),
(6, 'Upcoming Releases', 'Publisher', 'New game releases and updates.', 170),
(7, 'Bug Reports', 'Customer', 'Report issues and bugs in games.', 90),
(8, 'Marketing Trends', 'Publisher', 'Trends in game marketing.', 160),
(9, 'Community Events', 'Customer', 'Gaming community events and meetups.', 130),
(10, 'Game Publishing', 'Publisher', 'Guidelines for game publishing.', 140);

INSERT INTO Orders (Order_ID, Customer_ID, Payment_Method, Billing_Email, Total) VALUES
(1, 1, 'Credit', 'alice@example.com', 49.99),
(2, 2, 'Debit', 'bob@example.com', 29.99),
(3, 3, 'UPI', 'charlie@example.com', 59.99),
(4, 4, 'PayPal', 'david@example.com', 19.99),
(5, 5, 'Credit', 'emma@example.com', 39.99),
(6, 6, 'Debit', 'frank@example.com', 24.99),
(7, 7, 'UPI', 'grace@example.com', 69.99),
(8, 8, 'PayPal', 'henry@example.com', 34.99),
(9, 9, 'Credit', 'ivy@example.com', 44.99),
(10, 10, 'Debit', 'jack@example.com', 54.99);

INSERT INTO Game (Game_ID, Publisher_ID, Price, Genre, Title, Rating, Analytics) VALUES
(1, 101, 59.99, 'Action', 'Warrior Quest', 4.5, 500),
(2, 102, 39.99, 'RPG', 'Mystic Legends', 4.3, 450),
(3, 103, 29.99, 'Strategy', 'Empire Builder', 4.0, 300),
(4, 104, 49.99, 'Adventure', 'Jungle Explorer', 4.2, 400),
(5, 105, 19.99, 'Puzzle', 'Brain Teasers', 4.8, 600),
(6, 106, 24.99, 'Horror', 'Haunted Mansion', 4.1, 350),
(7, 107, 69.99, 'Shooter', 'Battlefield Elite', 4.6, 550),
(8, 108, 34.99, 'Sports', 'Soccer Stars', 4.4, 380),
(9, 109, 44.99, 'Racing', 'Speed Demons', 4.7, 480),
(10, 110, 54.99, 'Simulation', 'City Tycoon', 4.9, 700);

INSERT INTO Cart (Cart_ID, Customer_ID, Total) VALUES
(1, 1, 59.99),
(2, 2, 39.99),
(3, 3, 29.99),
(4, 4, 49.99),
(5, 5, 19.99),
(6, 6, 24.99),
(7, 7, 69.99),
(8, 8, 34.99),
(9, 9, 44.99),
(10, 10, 54.99);

INSERT INTO Moderator (Mod_ID, Genre, Issues_Resolved, Engagement) VALUES
(1, 'Action', 50, 200),
(2, 'RPG', 40, 180),
(3, 'Strategy', 30, 150),
(4, 'Adventure', 35, 160),
(5, 'Puzzle', 60, 220),
(6, 'Horror', 25, 140),
(7, 'Shooter', 55, 210),
(8, 'Sports', 45, 190),
(9, 'Racing', 48, 195),
(10, 'Simulation', 52, 205);

INSERT INTO Blog (Forum_ID, Type, Rating, Upvote_Downvote_Ratio) VALUES
(1, 'Moderator', 4.5, 2.0),
(2, 'User', 4.3, 1.8),
(3, 'Publisher', 4.0, 1.5),
(4, 'Moderator', 4.2, 1.6),
(5, 'User', 4.8, 2.2),
(6, 'Publisher', 4.1, 1.4),
(7, 'Moderator', 4.6, 2.1),
(8, 'User', 4.4, 1.9),
(9, 'Publisher', 4.7, 2.0),
(10, 'Moderator', 4.9, 2.3);

INSERT INTO Reviews (Game_ID, Customer_ID, Descriptions, Analytics) VALUES
(1, 1, 'Great gameplay!', 10),
(2, 2, 'Amazing story.', 8),
(3, 3, 'Challenging but fun.', 9),
(4, 4, 'Loved the adventure!', 7),
(5, 5, 'Mind-blowing puzzles.', 10),
(6, 6, 'Super scary!', 6),
(7, 7, 'Best shooter ever!', 9),
(8, 8, 'Really fun soccer game.', 8),
(9, 9, 'Great racing experience.', 9),
(10, 10, 'Very addictive sim game.', 10);

INSERT INTO Customer_Cart (Customer_ID, Cart_ID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO Publishers (Publisher_ID, Game_ID, Price) VALUES
(101, 1, 59.99),
(102, 2, 39.99),
(103, 3, 29.99),
(104, 4, 49.99),
(105, 5, 19.99),
(106, 6, 24.99),
(107, 7, 69.99),
(108, 8, 34.99),
(109, 9, 44.99),
(110, 10, 54.99);

INSERT INTO Games_Genres (Game_ID, Genre) VALUES
(1, 'Action'),
(2, 'RPG'),
(3, 'Strategy'),
(4, 'Adventure'),
(5, 'Puzzle'),
(6, 'Horror'),
(7, 'Shooter'),
(8, 'Sports'),
(9, 'Racing'),
(10, 'Simulation');

