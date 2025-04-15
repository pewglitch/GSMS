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
