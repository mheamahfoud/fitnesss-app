# Fitness App 🏋️‍♂️

A comprehensive fitness tracking application with workout management, goal setting, and program tracking.

## 🛠 Prerequisites

Before installation, ensure your system meets these requirements:

```bash
# Verify Node.js and npm versions
node -v  # Requires v18.x or higher
npm -v   # Requires v9.x or higher
git --version


git clone https://github.com/mheamahfoud/fitness-app.git
cd fitness-app

npm install

# Run initial database migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate


npm run dev