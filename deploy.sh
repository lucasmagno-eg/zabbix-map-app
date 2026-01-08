#!/bin/bash

# Script de deploy para aplicação Zabbix Map

echo "=== Configuração da Aplicação Zabbix Map ==="

# Criar diretórios
mkdir -p backend frontend

# Copiar arquivos .env de exemplo
cp backend/.env.example backend/.env

echo ""
echo "Por favor, configure as variáveis de ambiente no arquivo backend/.env:"
echo ""
echo "1. URL da API do Zabbix"
echo "2. Usuário e senha do Zabbix"
echo "3. Chave secreta JWT"
echo ""

read -p "Pressione Enter quando tiver configurado o arquivo .env..."

# Construir e iniciar containers
echo "Construindo containers Docker..."
docker-compose build

echo ""
echo "Iniciando aplicação..."
docker-compose up -d

echo ""
echo "Aplicação iniciada com sucesso!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"
