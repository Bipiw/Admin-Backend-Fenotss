const fs = require('fs');
const path = require('path');

const envContent = `DATABASE_URL="postgresql://user:password@localhost:5432/fenotss"
NEXTAUTH_SECRET="supersecretchangeinproduction"
NEXTAUTH_URL="http://localhost:3000"`;

fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
console.log('.env file created successfully');
