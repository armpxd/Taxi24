# Taxi24

Taxi24 es una nueva startup que quiere revolucionar la industria del transporte proporcionando
una solución de marca blanca existentes.

La app esta hecha con la tecnologia de nestjs en conjunto con la base de datos de postgress sql.

## Endpoints

La app de taxi24 cuenta con 6 endpoint (passengers, drivers, rides, invoices, locations, persons) para poder interactuar con la app un poco mas abajo detallamos cada uno de ellos

### Persona

- `GET /api/persons` Obtienes todas las personas
- `GET /api/persons/:id` Obtienes una persona. Requiere el parametro id.

### Ubicacion

- `GET /locations` Obtienes una lista de todas las ubicaciones

### Pasajero

- `GET /api/passengers` Obtienes todos los pasajeros
- `GET /api/passengers/:id` Obtienes un pasajero. Requiere el parametro id.
- `POST /api/passengers` Crea un pasajero enviado por body el siguiente formato

```
{
    "name": "TEXT",
    "lastName": "TEXT",
    "phoneNumber": "TEXT",
    "email": "TEXT"
}
```

Nota: el numero de telefono debe estar en el formato +# ### ####. Ejemplo +1 809 364 2161

### Conductor

- `GET /api/drivers` Obtienes todos los conductores.
- `GET /api/drivers/:id` Obtienes un conductor. Require el parametro id.
- `GET /api/drivers/availables` Obtienes todos los conductores disponibles.
- `GET /api/drivers/available3km/:latitude/:longitude` Obtienes una lista de los conductores a 3km de una ubicacion. Requiere los parametros latitude y longitude.

* `GET /api/drivers/findNearbyDrivers/:latitude/:longitude` Obtienes una lista de los 3 conductores mas cerca a tu punto de partida.
* `POST /api/drivers` Crea un conductor enviando por body los siguientes parametros.

```
{
    "name": "TEXT",
    "lastName": "TEXT",
    "phoneNumber": "TEXT",
    "email": "TEXT",
    "latitude": "NUMBER",
    "longitude": "NUMBER",
    "available": "BOOLEAN"
}
```
Nota: el numero de telefono debe estar en el formato +# ### ####. Ejemplo +1 809 364 2161
### Viajes

- `GET /api/rides` Obtienes una lista de todos los viajes.
- `GET /api/rides/:id` Obtienes un viaje. Requiere el parametro id.
- `GET /api/status/active` Obtiene todos los viajes activos.
- `POST /api/rides` Crea un viaje enviando por body los siguiente parametros.

```
{
    "passengerId":"NUMBER",
    "driverId":"NUMBER",
    "startLatitude":"NUMBER",
    "startLongitude":"NUMBER",
    "endLatitude": "NUMBER",
    "endLongitude":"NUMBER'
}

```

- `PATCH /api/complete/:id` Completa un viaje. Requiere pasarle el Id de viaje por parametro.

### Factura

- `GET /invoices` Obtiene lista de todas las facturas.
- `GET /invoices/:id` Obtiene una factura. requiere el parametro id.

# Instalación

## Configuraciones previas

Se necesitan las siguientes tecnologias:

- Nodejs
- Nestjs
- PostgreSQL

## Base de datos

La aplicacion cuenta de 6 entidades que son las siguientes

- Persona - Person
- Ubicacion - Location
- Pasajero - Passenger
- Conductor - Drive
- Viaje - Ride
- Factura - Invoice

Para crear la base de datos debes ir a la interfaz grafica de tu base de datos, pudiera ser `PG Admin` o tu consola y crear un base de datos llamada `taxi24`

Luego debe crear en el `root` o carpeta principal de tu proyecto un archivo `.env` que se usaria para guardar las variables de entorno de la aplicacion.

El archivo `.env` debe tener las siguientes variables:

```
PG_HOST
PG_PORT
PG_USERNAME
PG_PASSWORD
DATABASE_NAME
```

Ejemplo de `.env`

```
PG_HOST="localhost"
PG_PORT=5432
PG_USERNAME="postgres"
PG_PASSWORD="admin"
DATABASE_NAME="taxi24"
```

## Ejecutar

El primer comando que debes ejecutar para instalar las dependencias debe ser:

```bash
npm install
```

Para ejecutar el proyecto puede utilizar el siguiente comando:

```bash
npm run start

```

O si quieres en modo desarrollo

```bash
npm run start:dev
```

## Pruebas

Para ejecutar las pruebas unitarias ejecute el siguiente comando:

```bash
npm run test
```
## Data de prueba

Para generar data de prueba debe ejecutar el siguiente comando:

```bash 
npm run seed:run
```
