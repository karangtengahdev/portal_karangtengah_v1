FROM node:22-alpine

WORKDIR /app

# Install dependencies terlebih dahulu (untuk caching)
COPY package*.json ./
RUN npm install

# Salin semua kode frontend
COPY . .

EXPOSE 5173

# Menjalankan Vite dan membuka akses ke host
CMD ["npm", "run", "dev", "--", "--host"]