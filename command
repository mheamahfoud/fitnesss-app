# Verify Node.js and Git
node -v
npm -v
git --version

# Clone or copy project
git clone https://github.com/your-username/fitness-app.git
cd fitness-app

# Install dependencies
npm install

# Set up environment
touch .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "DATABASE_URL=file:./dev.db" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# Set up Prisma
npx prisma migrate dev --name init
npx prisma generate

# Run the app
npm run dev