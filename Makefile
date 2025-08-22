# UPT Services - Makefile
# =======================

.PHONY: help install dev build deploy test clean

# Variables
PHP_PORT=8000
NODE_PORT=3000
PROJECT_DIR=/var/www/utpservice
BACKUP_DIR=backups

# Colores para output
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Muestra esta ayuda
	@echo "$(BLUE)UPT Services - Comandos disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Instala todas las dependencias
	@echo "$(BLUE)Instalando dependencias...$(NC)"
	chmod +x init-project.sh
	./init-project.sh
	chmod +x scripts/*.sh
	./scripts/post-install.sh

dev: ## Inicia servidor de desarrollo
	@echo "$(BLUE)Iniciando servidor de desarrollo en puerto $(PHP_PORT)...$(NC)"
	./scripts/dev-setup.sh
	php -S localhost:$(PHP_PORT) -t public

dev-node: ## Inicia servidor Node.js de desarrollo
	@echo "$(BLUE)Iniciando servidor Node.js en puerto $(NODE_PORT)...$(NC)"
	node server.js

build: ## Construye el proyecto para producción
	@echo "$(BLUE)Construyendo proyecto...$(NC)"
	mkdir -p public
	cp src/pages/index.html public/
	cp -r src/styles public/
	cp -r src/scripts public/
	cp -r src/assets public/
	cp -r src/api public/
	cp src/manifest.json public/
	@echo "$(GREEN)Proyecto construido en ./public/$(NC)"

deploy-ubuntu: ## Despliega en Ubuntu (requiere sudo)
	@echo "$(BLUE)Desplegando en Ubuntu...$(NC)"
	sudo chmod +x scripts/install-ubuntu.sh
	sudo ./scripts/install-ubuntu.sh

test: ## Ejecuta todas las pruebas
	@echo "$(BLUE)Ejecutando pruebas...$(NC)"
	# Verificar sintaxis PHP
	find src/api -name "*.php" -exec php -l {} \;
	# Verificar sintaxis JS
	npm run lint:js
	# Verificar CSS
	npm run lint:css
	@echo "$(GREEN)Pruebas completadas$(NC)"

test-php: ## Verifica sintaxis PHP
	@echo "$(BLUE)Verificando sintaxis PHP...$(NC)"
	find src/api -name "*.php" -exec php -l {} \;

test-server: ## Prueba el servidor local
	@echo "$(BLUE)Probando servidor...$(NC)"
	curl -I http://localhost:$(PHP_PORT) || echo "$(YELLOW)Servidor no disponible$(NC)"

backup: ## Crea backup del proyecto
	@echo "$(BLUE)Creando backup...$(NC)"
	mkdir -p $(BACKUP_DIR)
	tar -czf $(BACKUP_DIR)/backup_$$(date +%Y%m%d_%H%M%S).tar.gz src/ public/ config/ docs/
	@echo "$(GREEN)Backup creado en $(BACKUP_DIR)/$(NC)"

logs: ## Muestra logs en tiempo real
	@echo "$(BLUE)Mostrando logs...$(NC)"
	tail -f src/api/logs/contact_log.txt 2>/dev/null || echo "$(YELLOW)No hay logs disponibles$(NC)"

monitor: ## Verifica estado del sistema
	@echo "$(BLUE)Verificando estado del sistema...$(NC)"
	curl -s http://localhost/api/monitor.php | jq . || curl -s http://localhost:$(PHP_PORT)/api/monitor.php || echo "$(YELLOW)Monitor no disponible$(NC)"

clean: ## Limpia archivos temporales
	@echo "$(BLUE)Limpiando archivos temporales...$(NC)"
	rm -rf node_modules/.cache/
	rm -rf public/
	rm -rf vendor/
	find . -name "*.log" -delete 2>/dev/null || true
	@echo "$(GREEN)Limpieza completada$(NC)"

setup-ubuntu: ## Instala dependencias de Ubuntu
	@echo "$(BLUE)Instalando dependencias de Ubuntu...$(NC)"
	sudo apt update
	sudo apt install -y apache2 php8.1 php8.1-fpm php8.1-curl php8.1-mbstring php8.1-xml
	sudo a2enmod rewrite headers expires deflate

permissions: ## Configura permisos para producción
	@echo "$(BLUE)Configurando permisos...$(NC)"
	sudo chown -R www-data:www-data $(PROJECT_DIR)
	sudo chmod -R 755 $(PROJECT_DIR)
	sudo chmod -R 775 $(PROJECT_DIR)/api/logs

status: ## Muestra estado de servicios
	@echo "$(BLUE)Estado de servicios:$(NC)"
	systemctl status apache2 || echo "Apache: No disponible"
	systemctl status php8.1-fpm || echo "PHP-FPM: No disponible"
	systemctl status nginx || echo "Nginx: No disponible"

# Atajos rápidos
start: dev ## Alias para dev
stop: ## Detiene servicios de desarrollo
	@echo "$(BLUE)Deteniendo servicios...$(NC)"
	pkill -f "php -S" || true
	pkill -f "node server.js" || true

restart: stop start ## Reinicia servicios de desarrollo
