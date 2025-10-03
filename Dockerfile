# Dockerfile

# Используем официальный образ Node.js LTS (alpine для меньшего размера)
FROM node:lts-alpine

# Внутренняя рабочая директория контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости проекта
RUN npm install

# Копируем весь остальной код (server.js, db/, models/, middleware/ и т.д.)
# Все эти файлы окажутся внутри /app
COPY . .

# Порт, который слушает Express-додаток (согласно app.listen)
EXPOSE 3000

# Команда для запуска приложения
# ***ИСПРАВЛЕНО***: Запускаем server.js
CMD ["node", "server.js"]