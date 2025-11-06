-- Banco de dados: cafeteria_db
CREATE DATABASE cafeteria_db;
USE cafeteria_db;

-- Tabela de produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    data_pedido DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Inserção de dados na tabela produtos
INSERT INTO produtos (nome, descricao, preco, estoque) VALUES
('Café Expresso', 'Café forte e encorpado', 6.00, 25),
('Cappuccino', 'Café com leite vaporizado e espuma cremosa', 9.00, 15),
('Torta de Chocolate', 'Sobremesa artesanal com cacau 70%', 12.00, 10);

-- Inserção de dados na tabela pedidos
INSERT INTO pedidos (produto_id, quantidade) VALUES
(1, 2),
(2, 1),
(3, 3);