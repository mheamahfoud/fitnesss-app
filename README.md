# Fitness App Setup Guide

## Prerequisites
Make sure you have the following installed on your system:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mheamahfoud/fitness-app.git
cd fitness-app


npm install


npx prisma migrate dev --name init
npx prisma generate

npm run dev