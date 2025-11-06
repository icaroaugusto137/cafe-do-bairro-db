-- Banco de dados
CREATE DATABASE IF NOT EXISTS cafedobairro_db;
USE cafedobairro_db;

-- ==============================
-- TABELA: categorias
-- ==============================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255)
);

INSERT INTO categorias (nome, descricao) VALUES
('Bebidas', 'Cafés, chás e outras bebidas'),
('Sobremesas', 'Tortas e doces artesanais');

-- ==============================
-- TABELA: produtos
-- ==============================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    imagem_url VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO produtos (categoria_id, nome, descricao, preco, imagem_url) VALUES
(1, 'Café Expresso', 'Grãos selecionados e aroma intenso.', 6.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),
(1, 'Cappuccino', 'Leite vaporizado e espuma cremosa.', 9.00, 'https://images.unsplash.com/photo-1510626176961-4b37d0a6a33a?auto=format&fit=crop&w=800&q=80'),
(2, 'Torta de Chocolate', 'Feita com cacau 70% e toque artesanal.', 12.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');

-- ==============================
-- TABELA: clientes
-- ==============================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clientes (nome, telefone, email) VALUES
('João Silva', '(11) 98888-1234', 'joao@email.com'),
('Maria Santos', '(11) 97777-4567', 'maria@email.com'),
('Pedro Lima', '(11) 96666-7890', 'pedro@email.com');

-- ==============================
-- TABELA: pedidos
-- ==============================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    total DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * (SELECT preco FROM produtos WHERE produtos.id = produto_id)) STORED,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'preparando', 'entregue') DEFAULT 'pendente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Exemplo de pedidos
INSERT INTO pedidos (cliente_id, produto_id, quantidade, status) VALUES
(1, 1, 2, 'entregue'),
(2, 3, 1, 'preparando'),
(3, 2, 1, 'pendente');
