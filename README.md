# ☕ Café do Bairro — Sistema Web + Banco de Dados

Aplicação web desenvolvida no contexto do **Projeto Integrador em Tecnologia da Informação II (UFMS Digital)**, com foco em **desenvolvimento web dinâmico**, **modelagem de banco de dados relacional** e **controle de versão com Git e GitHub**.

O projeto combina **HTML5, TailwindCSS e MySQL**, simulando o sistema online de uma cafeteria moderna e responsiva.

---

## 🚀 Funcionalidades

- Página inicial estilizada com **Tailwind CSS** (totalmente responsiva e com dark mode);
- Menu de produtos dinâmico (dados vindos do banco de dados);
- Estrutura de banco relacional com **produtos, categorias, clientes e pedidos**;
- API backend simples (em PHP ou Node.js) para integrar o banco ao frontend;
- Controle de versão com GitHub.

---

## 🗃️ Estrutura do Banco de Dados

Banco: `cafedobairro_db`

### **Tabelas principais**

| Tabela        | Descrição |
|----------------|------------|
| `categorias`   | Classifica produtos (ex: Bebidas, Sobremesas) |
| `produtos`     | Itens vendidos, com preço, descrição e imagem |
| `clientes`     | Armazena dados de contato dos clientes |
| `pedidos`      | Registra pedidos com data, status e total automático |

### **Relacionamentos**
- 1 categoria → N produtos  
- 1 cliente → N pedidos  
- 1 pedido → 1 produto  

---

## 💾 Script SQL

O arquivo `cafedobairro_db.sql` contém toda a estrutura do banco:

```sql
CREATE DATABASE cafedobairro_db;
USE cafedobairro_db;

CREATE TABLE categorias (...);
CREATE TABLE produtos (...);
CREATE TABLE clientes (...);
CREATE TABLE pedidos (...);