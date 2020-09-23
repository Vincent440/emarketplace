USE emarketplace_db;
SET FOREIGN_KEY_CHECKS=0;

-- inserts for products
INSERT INTO products (name, description, image_name, price, stock, categoryId, createdAt, updatedAt) VALUES
('$10 bamazon Gift Card', 'Use bamazon Gift Cards to shop at our sister site.', 'bamazon10.png', '8.99', '119', '2', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$25 bamazon Gift Card', 'Use bamazon Gift Cards to shop at our sister site.', 'bamazon25.png', '20.99', '75', '2', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$50 bamazon Gift Card', 'Use bamazon Gift Cards to shop at our sister site.', 'bamazon50.png', '39.99', '155', '2', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$75 bamazon Gift Card', 'Use bamazon Gift Cards to shop at our sister site.', 'bamazon75.png', '58.99', '32', '2', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$100 bamazon Gift Card', 'BEST VALUE... Use bamazon Gift Cards to shop at our sister site.', 'bamazon100.png', '75.99', '63', '2', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$10 eBook Cash', 'e-Book cash can be used at our e-Books sister site.', 'ebooks10.png', '8.99', '76', '1', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$25 eBook Cash', 'e-Book cash can be used at our e-Books sister site.', 'ebooks25.png', '20.99', '92', '1', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$50 eBook Cash', 'e-Book cash can be used at our e-Books sister site.', 'ebooks50.png', '39.99', '43', '1', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$75 eBook Cash', 'e-Book cash can be used at our e-Books sister site.', 'ebooks75.png', '58.99', '16', '1', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$100 eBook Cash', 'BEST VALUE... e-Book cash can be used at our e-Books sister site.', 'ebooks100.png', '75.99', '11', '1', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$10 eGame Cash', 'e-Game cash can be used at our e-Games sister site.', 'egames10.png', '8.99', '41', '3', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$25 eGame Cash', 'e-Game cash can be used at our e-Games sister site.', 'egames25.png', '20.99', '21', '3', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$50 eGame Cash', 'e-Game cash can be used at our e-Games sister site.', 'egames50.png', '39.99', '18', '3', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$75 eGame Cash', 'e-Game cash can be used at our e-Games sister site.', 'egames75.png', '58.99', '3', '3', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('$100 eGame Cash', 'BEST VALUE... e-Game cash can be used at our e-Games sister site.', 'egames100.png', '75.99', '4', '3', '2019-05-08 21:09:01', '2019-05-08 21:09:01');

-- inserts for categories
INSERT INTO categories (name, description, image_name) VALUES
('e-Books', 'Shop  e-Books!', 'ebooks.png'),
('bamazon', 'Shop bamazon!', 'bamazon.png'),
('e-Games', 'Shop e-Games!', 'egames.png');

-- inserts for users
INSERT INTO users (username, password, email, createdAt, updatedAt) VALUES
('mike', '$2b$10$6ovU8giiTYBSIVMc7GLy5evwtzAZcaWpxLamt7BNotH.JUdZ7btnC', 'test@test.com', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('jdoe', '$2b$10$A3DkmZhJI/ZRSHyBQLc4U.IDiGtuPYPZo8Ffcg4Gs9C290H5Lskya', 'johndoe@gmail.com', '2019-05-08 21:09:01', '2019-05-08 21:09:01'),
('janedoe', '$2b$10$dFcPPJQ6iijpdaHH475xqOoYJq3Q7YY3itx.Hotly.XL9y3URc1m6', 'janedoe@gmail.com', '2019-05-08 21:09:01', '2019-05-08 21:09:01');

-- inserts for cart_items
INSERT INTO cart_items (num, each_price, userId, productId) VALUES
('1', '20.99', '1', '12'),
('1', '39.99', '1', '13'),
('4', '8.99', '1', '6'),
('3', '8.99', '2', '1'),
('2', '75.99', '2', '5'),
('1', '58.99', '2', '14'),
('2', '20.99', '2', '12');

SET FOREIGN_KEY_CHECKS=1;