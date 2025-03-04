# Proyecto 7 / Backend para App Fullstack de comercio electrónico

Este proyecto corresponde al backend de la app fullstack KüpanStore, aplicación web de comercio electrónico, cuyo frontend se encuentra en el siguiente repositorio: https://github.com/Vahen1981/P7-Front 

En el caso de querer hacer llamadas a la api actualmente desplegada en railway, es posible hacerlo con este enlace: `https//:railwayp7-back-production.up.railway.app`

Este repositorio contiene únicamente el backend de la aplicación.

## Características

- **Modelos:** Implementa modelos para productos y usuarios.
- **Controladores:** Incorpora controladores para realizar operaciones CRUD para productos y usuarios.
- **Rutas:** Define rutas para comunicación con el frontend
- **Autenticación:** Incluye middleware de autenticación para rutas protegidas

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para el servidor.
- **Express**: Framework para la creación de la API RESTful.
- **MongoDB Atlas**: Base de datos NoSQL en la nube para almacenamiento de datos.
- **Mongoose**: ODM para modelar los datos en MongoDB.
- **Cors**: Middleware para permitir que el servidor acepte solicitudes desde dominios distintos al propio. Útil en aplicaciones web con frontend y backend separados.
- **jsonwebtoken**: Librería para la creación y verificación de tokens JWT (JSON Web Tokens).
- **bcryptjs**: Librería para encriptar contraseñas antes de almacenarlas en la base de datos y también para verificarlas
- **Stripe**: Plataforma de pago en línea que permite aceptar pagos con tarjeta de crédito, débito, y otros métodos.

### Despliegue

- **Railway**: Plataforma utilizada para el despliegue continuo del servidor.

## Instalación y configuración

Para ejecutar el proyecto en tu entorno local descarga y sigue las instrucciones listadas abajo.

### Frontend
Descarga y sigue las instrucciones del frontend aquí: [link](https://github.com/Vahen1981/P7-Front)

### Backend

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/Vahen1981/P7-Back.git
   cd P7-Back
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:

   Crea un archivo `.env` en la carpeta raíz con las siguientes variables:

   ```env
    PORT=8000
    MONGODB_URI=TU_URI_DE_MONGO
    SECRET=TU_SECRET
    STRIPE_SECRET_KEY=TU_STRIPE_KEY
   ```

4. **Modifica las url de stripe**:

   Para ejecutarlo en tu entorno local debes descomentar las líneas 35 y 36, y comentar las líneas 37 y 38 del archivo `controller/checkoutController.jsx`


5. **Inicia la aplicación frontend**:
Utliza nodemon para desarrollo

   ```bash
   nodemon
   ```

El servidor estará disponible en `http://localhost:8000`.

## Uso

La mayoría de las operaciones CRUD serán manejadas por el frontend a excepción de la creación de productos para las cuales deberás hacer una solicitud con el método `POST` a la siguiente dirección: `http://localhost:8000/api/products/create`

Si se desea crea un nuevo producto en el servidor actualmente desplegado en la web, se puede hacer la solicitud `POST` en el siguiente enlace: `https://p7-back-production.up.railway.app/api/products/create`

Junto con la solicitud se debe incluir un json en el body que contenga los campos del siguiente ejemplo:

```json
{
    "title": "Zapatillas Running",
    "price": 59990,
    "description": "Ideales para tus salidas matutinas, unas zapatillas que entregan comodidad y calidad, además de un super look",
    "category": "men's clothing",
    "image": "https://res.cloudinary.com/dnosoakgt/image/upload/v1740870364/cld-sample-5.jpg",
    "rating": { 
        "rate": 4.5, 
        "count": 120 
        },
    "quantity": 10
}
```
El controlador creará un nuevo producto primero en stripe, desde donde obtendrá el id que stripe le otorgará, para luego crear el producto en mongodb atlas, en donde se incluirá también el id creado por stripe.

Para que el frontend pueda listar el nuevo producto en alguna categoría, el campo "category" debe tener alguna de estas opciones:
    `"men's clothing"`
    `"jewelery"`
    `"electronics"`
    `"women's clothing"`

### Nota
Para la aplicación actualmente desplegada en la web, los datos de los productos, fueron tomados y modificados de la api https://fakestoreapi.com/
