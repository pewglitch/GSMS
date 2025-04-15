-- Create carts for all existing customers who don't have one
INSERT INTO Cart (Customer_ID, Total)
SELECT c.Customer_ID, 0
FROM Customer c
LEFT JOIN Cart cart ON c.Customer_ID = cart.Customer_ID
WHERE cart.Customer_ID IS NULL;

-- Link carts to customers in the Customer_Cart table
INSERT INTO Customer_Cart (Customer_ID, Cart_ID)
SELECT c.Customer_ID, cart.Cart_ID
FROM Customer c
JOIN Cart cart ON c.Customer_ID = cart.Customer_ID
LEFT JOIN Customer_Cart cc ON c.Customer_ID = cc.Customer_ID
WHERE cc.Customer_ID IS NULL; 