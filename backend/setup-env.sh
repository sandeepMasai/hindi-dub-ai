#!/bin/bash

# Setup script for backend .env file

echo "🔧 Setting up backend environment..."

# Create .env file
cat > .env << 'EOF'
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://sk245444_db_user:swxYrCkPNE0OTZyg@cluster0.47hztun.mongodb.net/dubai?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=my_super_secret_jwt_key_12345_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📝 Contents:"
cat .env
echo ""
echo "🚀 Now run: npm run dev"
