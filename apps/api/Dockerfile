FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
ENV PORT=4000
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && node src/index.js"]
