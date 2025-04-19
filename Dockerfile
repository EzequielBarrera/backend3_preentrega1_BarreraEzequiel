# Imagen base
FROM node

# Carpeta de trabajo donde se guarda el proyecto
WORKDIR /app

# Copia el archivo package.json al directorio raíz
COPY package*.json ./

# Ejecutamos el comando para instalar las independencias
RUN npm install

# Copiamos todo el código del resto del proyecto
COPY . .

# El puerto a exponer en el contenedor
EXPOSE 8080

# Le pasamos el comando para prender el servidor
CMD ["npm", "start"]