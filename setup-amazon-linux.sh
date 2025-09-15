#!/bin/bash

# Amazon Linux 2 Setup Script for Order Inventory System
set -e

echo "=== Order Inventory System - Amazon Linux 2 Setup ==="

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installations
echo "Verifying installations..."
docker --version
docker-compose --version

echo "=== Setup Complete ==="
echo "Please log out and log back in for Docker group changes to take effect."
echo "Then run: docker-compose up -d --build"
echo ""
echo "Access points after running:"
echo "- Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "- Backend API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo "- MySQL: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3306"
