DROP DATABASE IF EXISTS gsms2;
CREATE DATABASE gsms2;
USE gsms2;

CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Billing_Email VARCHAR(50) NOT NULL UNIQUE,
    Payment_Method ENUM('Credit', 'Debit', 'UPI', 'PayPal') NOT NULL,
    CONSTRAINT chk_valid_email_length CHECK (CHAR_LENGTH(Billing_Email) > 5)
);

CREATE TABLE Publisher (
    Publisher_ID INT PRIMARY KEY AUTO_INCREMENT,
    License_Number CHAR(60) NOT NULL UNIQUE,
    Type ENUM('Company', 'Individual') NOT NULL
);

CREATE TABLE Forum (
    Forum_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100) NOT NULL,
    Type ENUM('Customer', 'Publisher') NOT NULL,
    Description TEXT NOT NULL,
    Analytics INT DEFAULT 0,
    CONSTRAINT chk_analytics_non_negative CHECK (Analytics >= 0)
);

CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT NOT NULL,
    Payment_Method ENUM('Credit', 'Debit', 'UPI', 'PayPal') NOT NULL,
    Billing_Email VARCHAR(50) NOT NULL,
    Total DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_total_positive CHECK (Total >= 0),
    CONSTRAINT chk_billing_email_length CHECK (CHAR_LENGTH(Billing_Email) > 5),
    CONSTRAINT fk_orders_customer FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

CREATE TABLE Game (
    Game_ID INT PRIMARY KEY AUTO_INCREMENT,
    Publisher_ID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Genre VARCHAR(50) NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Rating FLOAT DEFAULT 0,
    Analytics INT DEFAULT 0,
    CONSTRAINT chk_price_non_negative CHECK (Price >= 0),
    CONSTRAINT chk_rating_range CHECK (Rating BETWEEN 0 AND 5),
    CONSTRAINT chk_analytics_non_negative2 CHECK (Analytics >= 0),
    CONSTRAINT fk_game_publisher FOREIGN KEY (Publisher_ID) REFERENCES Publisher(Publisher_ID)
);

CREATE TABLE Cart (
    Cart_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT UNIQUE NOT NULL,
    Total DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT chk_cart_total_non_negative CHECK (Total >= 0),
    CONSTRAINT fk_cart_customer FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

CREATE TABLE Moderator (
    Mod_ID INT PRIMARY KEY AUTO_INCREMENT,
    Genre VARCHAR(50) NOT NULL,
    Issues_Resolved INT DEFAULT 0,
    Engagement INT DEFAULT 0,
    CONSTRAINT chk_issues_resolved_non_negative CHECK (Issues_Resolved >= 0),
    CONSTRAINT chk_engagement_non_negative CHECK (Engagement >= 0)
);

CREATE TABLE Blog (
    Forum_ID INT PRIMARY KEY,
    Type ENUM('Moderator', 'User', 'Publisher') NOT NULL,
    Rating FLOAT DEFAULT 0,
    Upvote_Downvote_Ratio FLOAT DEFAULT 0,
    CONSTRAINT chk_blog_rating_range CHECK (Rating BETWEEN 0 AND 5),
    CONSTRAINT chk_blog_ratio_non_negative CHECK (Upvote_Downvote_Ratio >= 0),
    CONSTRAINT fk_blog_forum FOREIGN KEY (Forum_ID) REFERENCES Forum(Forum_ID)
);

CREATE TABLE Reviews (
    Game_ID INT NOT NULL,
    Customer_ID INT NOT NULL,
    Descriptions VARCHAR(10000) NOT NULL,
    Analytics FLOAT DEFAULT 0,
    CONSTRAINT chk_reviews_analytics_non_negative CHECK (Analytics >= 0),
    PRIMARY KEY (Game_ID, Customer_ID),
    CONSTRAINT fk_reviews_customer FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    CONSTRAINT fk_reviews_game FOREIGN KEY (Game_ID) REFERENCES Game(Game_ID)
);

CREATE TABLE Customer_Cart (
    Customer_ID INT NOT NULL,
    Cart_ID INT NOT NULL,
    PRIMARY KEY (Customer_ID, Cart_ID),
    CONSTRAINT fk_customer_cart_customer FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    CONSTRAINT fk_customer_cart_cart FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID)
);


CREATE TABLE Publishers (
    Publisher_id INT,
    Game_ID INT,
    Price DECIMAL(10,2),
    PRIMARY KEY (Publisher_id, Game_ID),
    FOREIGN KEY (Publisher_id) REFERENCES Publisher(Publisher_id),
    FOREIGN KEY (Game_ID) REFERENCES Game(Game_ID)
);


CREATE TABLE Games_Genres (
    Game_ID INT,
    Genre VARCHAR(50),
    PRIMARY KEY (Game_ID),
    FOREIGN KEY (Game_ID) REFERENCES Game(Game_ID)
);

CREATE TABLE Cart_Game (
    Cart_ID INT NOT NULL,
    Game_ID INT NOT NULL,
    Quantity INT DEFAULT 1 CHECK (Quantity > 0),
    PRIMARY KEY (Cart_ID, Game_ID),
    FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID),
    FOREIGN KEY (Game_ID) REFERENCES Game(Game_ID)
);

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
(10, 'Jack Turner', 'jack@example.com', 'Debit'),
(11, 'Katherine Brooks', 'katherine@example.com', 'UPI'),
(12, 'Liam Johnson', 'liam@example.com', 'Credit'),
(13, 'Mia Roberts', 'mia@example.com', 'Debit'),
(14, 'Noah Lewis', 'noah@example.com', 'PayPal'),
(15, 'Olivia Hall', 'olivia@example.com', 'UPI'),
(16, 'Paul Wright', 'paul@example.com', 'Credit'),
(17, 'Quinn Scott', 'quinn@example.com', 'Debit'),
(18, 'Ryan King', 'ryan@example.com', 'UPI'),
(19, 'Sophia Baker', 'sophia@example.com', 'PayPal'),
(20, 'Thomas Green', 'thomas@example.com', 'Credit'),
(21, 'Uma Nelson', 'uma@example.com', 'Debit'),
(22, 'Victor Harris', 'victor@example.com', 'UPI'),
(23, 'Wendy Moore', 'wendy@example.com', 'PayPal'),
(24, 'Xavier Perry', 'xavier@example.com', 'Credit'),
(25, 'Yara Rogers', 'yara@example.com', 'Debit'),
(26, 'Zane Bryant', 'zane@example.com', 'UPI'),
(27, 'Abigail Fisher', 'abigail@example.com', 'PayPal'),
(28, 'Benjamin Clark', 'benjamin@example.com', 'Credit'),
(29, 'Charlotte Morris', 'charlotte@example.com', 'Debit'),
(30, 'Daniel White', 'daniel@example.com', 'UPI'),
(31, 'Evelyn Young', 'evelyn@example.com', 'PayPal'),
(32, 'Gabriel Thomas', 'gabriel@example.com', 'Credit'),
(33, 'Hannah Walker', 'hannah@example.com', 'Debit'),
(34, 'Isaac Allen', 'isaac@example.com', 'UPI'),
(35, 'Jessica Wilson', 'jessica@example.com', 'PayPal');

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
(110, 'LIC890J', 'Individual'),
(111, 'LIC111K', 'Company'),
(112, 'LIC222L', 'Individual'),
(113, 'LIC333M', 'Company'),
(114, 'LIC444N', 'Individual'),
(115, 'LIC555O', 'Company'),
(116, 'LIC666P', 'Individual'),
(117, 'LIC777Q', 'Company'),
(118, 'LIC888R', 'Individual'),
(119, 'LIC999S', 'Company'),
(120, 'LIC000T', 'Individual'),
(121, 'LIC135U', 'Company'),
(122, 'LIC246V', 'Individual'),
(123, 'LIC357W', 'Company'),
(124, 'LIC468X', 'Individual'),
(125, 'LIC579Y', 'Company'),
(126, 'LIC680Z', 'Individual'),
(127, 'LIC791A1', 'Company'),
(128, 'LIC802B1', 'Individual'),
(129, 'LIC913C1', 'Company'),
(130, 'LIC024D1', 'Individual'),
(131, 'LIC135E1', 'Company'),
(132, 'LIC246F1', 'Individual'),
(133, 'LIC357G1', 'Company'),
(134, 'LIC468H1', 'Individual'),
(135, 'LIC579I1', 'Company');


INSERT INTO Forum (Forum_ID, Title, Type, Description, Analytics) VALUES
(1, 'Game Reviews', 'Customer', 'Discuss and review games.', 100),
(2, 'Publisher Announcements', 'Publisher', 'Latest updates from publishers.', 2001),
(3, 'Customer Support', 'Customer', 'Support and troubleshooting.', 150),
(4, 'Game Development', 'Publisher', 'Insights on game development.', 180),
(5, 'Gaming Strategies', 'Customer', 'Tips and tricks for gamers.', 120),
(6, 'Upcoming Releases', 'Publisher', 'New game releases and updates.', 170),
(7, 'Bug Reports', 'Customer', 'Report issues and bugs in games.', 90),
(8, 'Marketing Trends', 'Publisher', 'Trends in game marketing.', 160),
(9, 'Community Events', 'Customer', 'Gaming community events and meetups.', 130),
(10, 'Game Publishing', 'Publisher', 'Guidelines for game publishing.', 140),
(11, 'Indie Game Showcase', 'Customer', 'Showcase and discuss indie games.', 110),
(12, 'Investor Relations', 'Publisher', 'Investor updates and reports.', 2100),
(13, 'Esports Tournaments', 'Customer', 'Discuss and organize esports tournaments.', 190),
(14, 'Beta Testing', 'Publisher', 'Manage beta testing feedback.', 175),
(15, 'Game Modding', 'Customer', 'Create and share game mods.', 140),
(16, 'Monetization Insights', 'Publisher', 'Discuss monetization strategies.', 16500),
(17, 'Player Feedback', 'Customer', 'Provide feedback for developers.', 145),
(18, 'Licensing Queries', 'Publisher', 'Resolve licensing-related issues.', 155),
(19, 'Virtual Reality Gaming', 'Customer', 'Talk about VR games and experiences.', 12500),
(20, 'Localization Support', 'Publisher', 'Localization and translation updates.', 150),
(21, 'Gaming News', 'Customer', 'Stay updated with gaming news.', 170),
(22, 'Market Analysis', 'Publisher', 'Analyze game market trends.', 220),
(23, 'Content Creation', 'Customer', 'Tips for creating gaming content.', 135),
(24, 'Developer Q&A', 'Publisher', 'Developers answer community questions.', 180),
(25, 'Mobile Gaming', 'Customer', 'Discuss mobile games and apps.', 200),
(26, 'Gaming Hardware', 'Customer', 'Reviews and discussions on gaming hardware.', 145),
(27, 'Global Expansion', 'Publisher', 'Strategies for global game launches.', 190),
(28, 'Streaming Insights', 'Customer', 'Tips for game streaming and broadcasting.', 175),
(29, 'Legal Discussions', 'Publisher', 'Legal topics in the gaming industry.', 160),
(30, 'Classic Games', 'Customer', 'Talk about retro and classic games.', 130),
(31, 'Partnership Proposals', 'Publisher', 'Propose and discuss partnerships.', 155),
(32, 'Fan Art', 'Customer', 'Share and appreciate gaming fan art.', 115),
(33, 'Game Design Theory', 'Publisher', 'Discuss game design principles.', 185),
(34, 'Competitive Gaming', 'Customer', 'Insights into competitive gaming.', 195),
(35, 'Game Engines', 'Publisher', 'Discussion about game engine technology.', 175);


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
(10, 10, 'Debit', 'jack@example.com', 54.99),
(11, 11, 'UPI', 'katherine@example.com', 64.99),
(12, 12, 'Credit', 'liam@example.com', 74.99),
(13, 13, 'Debit', 'mia@example.com', 28.99),
(14, 14, 'PayPal', 'noah@example.com', 39.49),
(15, 15, 'UPI', 'olivia@example.com', 52.99),
(16, 16, 'Credit', 'paul@example.com', 63.99),
(17, 17, 'Debit', 'quinn@example.com', 33.99),
(18, 18, 'UPI', 'ryan@example.com', 44.99),
(19, 19, 'PayPal', 'sophia@example.com', 59.49),
(20, 20, 'Credit', 'thomas@example.com', 22.99);

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
(10, 110, 54.99, 'Simulation', 'City Tycoon', 4.9, 700),
(11, 101, 49.99, 'RPG', 'Knight Conquest', 4.3, 430),
(12, 102, 39.99, 'RPG', 'Dragon Realm', 4.6, 460),
(13, 103, 29.99, 'Strategy', 'Kingdom Tactics', 4.1, 310),
(14, 104, 59.99, 'Adventure', 'Treasure Island', 4.7, 490),
(15, 105, 24.99, 'Puzzle', 'Logic Masters', 4.5, 520),
(16, 106, 19.99, 'Horror', 'Zombie Nightmare', 4.2, 360),
(17, 107, 69.99, 'Shooter', 'Gunfire Glory', 4.8, 580),
(18, 108, 34.99, 'Sports', 'Tennis Titans', 4.3, 390),
(19, 109, 44.99, 'Racing', 'Drift Kings', 4.6, 460),
(20, 110, 54.99, 'Simulation', 'Farm Empire', 4.7, 720),
(21, 101, 59.99, 'Action', 'Alien Invasion', 4.5, 510),
(22, 102, 39.99, 'RPG', 'Heroes of Myth', 4.4, 455),
(23, 103, 29.99, 'Strategy', 'Battle Commanders', 4.0, 305),
(24, 104, 49.99, 'Adventure', 'Lost in Time', 4.3, 410),
(25, 105, 19.99, 'Puzzle', 'Number Quest', 4.9, 630),
(26, 106, 24.99, 'Horror', 'Ghost Whisperer', 4.1, 365),
(27, 107, 69.99, 'Shooter', 'Warzone Elite', 4.7, 570),
(28, 108, 34.99, 'Sports', 'Basketball Blitz', 4.4, 385),
(29, 109, 44.99, 'Racing', 'Nitro Rush', 4.8, 490),
(30, 110, 54.99, 'Simulation', 'Space Colony', 4.9, 740);

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
(1, 'Action', 10, 200),
(2, 'RPG', 4, 180),
(3, 'Strategy', 30, 150),
(4, 'Adventure', 35, 160),
(5, 'Puzzle', 60, 220),
(6, 'Horror', 25, 140),
(7, 'Shooter', 5, 210),
(8, 'Sports', 45, 190),
(9, 'Racing', 48, 195),
(10, 'Simulation', 52, 205),
(11, 'Action', 53, 215),
(12, 'RPG', 38, 10),
(13, 'Strategy', 3, 155),
(14, 'Adventure', 37, 165),
(15, 'Puzzle', 63, 225),
(16, 'Horror', 27, 145),
(17, 'Shooter', 57, 212),
(18, 'Sports', 47, 193),
(19, 'Racing', 50, 200),
(20, 'Simulation', 55, 210);

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

INSERT INTO Cart_Game (Cart_ID, Game_ID, Quantity) 
VALUES 
(1, 1, 2),
(1, 2, 1),
(2, 3, 4),
(2, 4, 3),
(3, 5, 1),
(3, 6, 2),
(4, 7, 5),
(4, 8, 1),
(5, 9, 3),
(5, 10, 2);

-- deadline 3 (queries)
-- query 1
SELECT 
    g.Title AS Game_Title, 
    g.Rating, 
    p.Publisher_ID, 
    p.License_Number, 
    COALESCE(COUNT(cg.Game_ID), 0) AS Total_Purchases
FROM Game g
JOIN Publisher p ON g.Publisher_ID = p.Publisher_ID
LEFT JOIN Cart_Game cg ON g.Game_ID = cg.Game_ID
WHERE g.Genre = 'RPG'
GROUP BY g.Game_ID, g.Title, g.Rating, p.Publisher_ID, p.License_Number;


-- query 2 
SELECT p.Publisher_ID, p.License_Number, total_revenue
FROM Publisher p
JOIN (
    SELECT g.Publisher_ID, SUM(c.Total) AS total_revenue
    FROM Game g
    JOIN Cart c ON g.Game_ID = c.Cart_ID
    GROUP BY g.Publisher_ID
) revenue_per_publisher ON p.Publisher_ID = revenue_per_publisher.Publisher_ID
WHERE total_revenue = (
    SELECT MAX(total_revenue)
    FROM (
        SELECT SUM(c.Total) AS total_revenue
        FROM Game g
        JOIN Cart c ON g.Game_ID = c.Cart_ID
        GROUP BY g.Publisher_ID
    ) subquery
);

-- query 3 
SELECT c.Customer_ID, c.Name, SUM(o.Total) AS Total_Spent
FROM Customer c
JOIN Orders o ON c.Customer_ID = o.Customer_ID
GROUP BY c.Customer_ID, c.Name
HAVING SUM(o.Total) > (
    SELECT AVG(Total) FROM Orders
);

-- query 4
SELECT p.Publisher_ID, p.License_Number, p.Type
FROM Publisher p
WHERE p.Publisher_ID NOT IN (
    SELECT DISTINCT g.Publisher_ID FROM Game g
);

-- query 5
SELECT c.Customer_ID, c.Name, COUNT(o.Order_ID) AS Total_Orders,
       CASE 
           WHEN COUNT(o.Order_ID) >= 20 THEN 'Loyal'
           ELSE 'Regular'
       END AS Customer_Type
FROM Customer c
LEFT JOIN Orders o ON c.Customer_ID = o.Customer_ID
GROUP BY c.Customer_ID, c.Name;

-- query 6
select g.Game_ID, g.Title, g.Rating+count(r.Customer_ID) as Score
from Game g left join reviews r on g.Game_ID = r.Game_ID
group by g.Game_ID
order by score DESC
limit 3;

-- query 7
select Mod_ID, Genre, Issues_resolved
from Moderator
where Issues_resolved<(select avg(Issues_resolved)from Moderator);

-- query 8
SELECT P.Publisher_id, P.Type
FROM Publisher P
LEFT JOIN Game G ON P.Publisher_id = G.Publisher_ID
WHERE G.Game_ID IS NULL;

-- query 9
select Forum_ID, Rating, upvote_downvote_ratio as ratio
from blog
order by ratio DESC
limit 5;

-- query 10  
select distinct o.Customer_id
from Orders o join Game g 
on o.customer_id = o.customer_id
left join Reviews r on g.game_id = r.game_id and o.customer_id = r.customer_id
group by o.customer_id
having count(distinct g.game_id) = count(r.game_id);

-- query 11
SELECT C.Customer_id, C.Name
FROM Customer C
INNER JOIN `Orders` O ON C.Customer_id = O.Customer_id
WHERE O.Payment_method = 'UPI';

-- query 12
SELECT G.Title, G.Rating, P.Publisher_id
FROM Game G
INNER JOIN Publisher P ON G.Publisher_ID = P.Publisher_id
WHERE G.Rating > 4;

-- query 13
SELECT Payment_method, COUNT(*) AS Total_Orders
FROM `Orders`
GROUP BY Payment_method;

-- query 14
SELECT P.Publisher_id
FROM Publisher P
INNER JOIN Game G ON P.Publisher_id = G.Publisher_ID
GROUP BY P.Publisher_id
HAVING COUNT(DISTINCT G.Genre) > 1;

-- query 15
SELECT Forum_ID, Title, Analytics
FROM Forum
WHERE Analytics > 5000;

-- query 16
SELECT C.Customer_id, C.Name, SUM(O.Total) AS Total_Spent
FROM Customer C
INNER JOIN `Orders` O ON C.Customer_id = O.Customer_id
GROUP BY C.Customer_id, C.Name
HAVING COUNT(O.Order_id) > 3;

-- query 17
SELECT Genre, AVG(Rating) AS Average_Rating
FROM Game
GROUP BY Genre;

-- query 18
SELECT G.Game_ID, G.Title
FROM Game G
LEFT JOIN Reviews R ON G.Game_ID = R.Game_id
WHERE R.Game_id IS NULL;

-- query 19
SELECT Mod_id, Issues_resolved, Engagement
FROM Moderator
WHERE Issues_resolved < 10 AND Engagement > 50;
