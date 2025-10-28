#!/bin/bash

# Database configuration
DB_USER="labour_user"
DB_PASS="StrongPassword123"
DB_NAME="labour_mobility_db"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error message
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    echo "Starting MySQL service..."
    sudo systemctl start mysql
    sleep 2
fi

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    error "Failed to start MySQL service. Please check if MySQL is installed and running."
    exit 1
fi

# Create database and user
echo "Setting up database and user..."
sudo mysql -u root <<MYSQL_SCRIPT
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
MYSQL_SCRIPT

# Check if the setup was successful
if [ $? -eq 0 ]; then
    success "Database and user setup completed successfully!"
    echo "Database: $DB_NAME"
    echo "Username: $DB_USER"
    
    # Update .env file
    echo -e "\nUpdating backend .env file..."
    ENV_FILE="/home/nicksonkipkogei/Labour mobility/backend/.env"
    
    # Check if .env file exists
    if [ -f "$ENV_FILE" ]; then
        # Update DATABASE_URL
        sed -i 's|^DATABASE_URL=.*|DATABASE_URL="mysql://'$DB_USER':'$DB_PASS'@localhost:3306/'$DB_NAME'?connection_limit=5"|' "$ENV_FILE"
        success "Updated database configuration in $ENV_FILE"
    else
        error "$ENV_FILE not found. Please update it manually with the following:"
        echo "DATABASE_URL=\"mysql://$DB_USER:$DB_PASS@localhost:3306/$DB_NAME?connection_limit=5""
    fi
    
    # Run Prisma migrations
    echo -e "\nRunning database migrations..."
    cd "/home/nicksonkipkogei/Labour mobility/backend"
    npx prisma migrate dev --name init --skip-seed
    
    if [ $? -eq 0 ]; then
        success "Database migrations completed successfully!"
        
        # Show existing users
        echo -e "\nExisting users in the database:"
        mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT id, email, firstName, lastName, roleId FROM users;" 2>/dev/null || 
            echo "No users found or error accessing users table."
        
        # Start the backend server
        echo -e "\nStarting backend server..."
        npm run dev &
        
        success "Setup completed! You can now access the application."
        echo -e "\nFrontend: http://localhost:5173"
        echo "Backend API: http://localhost:5000/api"
    else
        error "Failed to run database migrations."
    fi
else
    error "Database setup failed. Please check the error messages above."
fi
