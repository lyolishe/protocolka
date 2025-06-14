# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем собранные файлы фронтенда в Nginx
COPY ./build /usr/share/nginx/html

# (Опционально) Заменяем дефолтный конфиг Nginx, если нужны особые настройки
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx по умолчанию слушает 80 порт, EXPOSE не обязателен, но для ясности оставим
EXPOSE 80