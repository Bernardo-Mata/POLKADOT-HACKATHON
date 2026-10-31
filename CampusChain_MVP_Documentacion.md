# CampusChain --- Documento maestro del MVP

> **Objetivo:** construir en cinco horas un marketplace universitario
> con identidad institucional, pagos tradicionales y un historial de
> pedidos verificable mediante smart contracts en Polkadot Hub EVM
> TestNet.\
> **Enfoque del hackathon:** confianza entre compradores y vendedores;
> no crear otro marketplace genérico.

------------------------------------------------------------------------

## 1. Resumen ejecutivo

CampusChain es una plataforma de comercio para comunidades
universitarias. Permite que estudiantes publiquen productos, realicen
pedidos y consulten un historial verificable de las etapas de cada
compra.

El marketplace es la interfaz. El valor diferencial es la **trazabilidad
de confianza**:

-   Identidad universitaria vinculada a una wallet.
-   Pedidos asociados a comprador y vendedor.
-   Registro on-chain de los cambios importantes de estado.
-   Confirmación del comprador al recibir el producto.
-   Historial y métricas de reputación basados en pedidos completados.

### Problema

En muchas universidades, estudiantes venden comida, postres, accesorios
y artículos escolares mediante grupos de mensajería o redes sociales. La
compra depende de recomendaciones informales y puede ser difícil conocer
el historial de un vendedor o comprobar cómo terminó un pedido.

### Solución

CampusChain organiza la oferta universitaria y registra en blockchain
las acciones relevantes de cada pedido. Así, las partes pueden consultar
un historial verificable y una reputación calculada a partir de
operaciones completadas.

### Propuesta de valor en una frase

**CampusChain convierte el comercio informal universitario en una
experiencia más confiable mediante identidad institucional, reputación e
historial de pedidos verificable.**

------------------------------------------------------------------------

## 2. Objetivos y criterios de éxito

### Objetivo general

Demostrar un flujo de compra universitario completo en el que una
operación tradicional ---pago en efectivo o transferencia--- tenga un
registro de estados verificable en blockchain.

### Objetivos específicos

1.  Permitir el acceso mediante correo universitario de demostración.
2.  Vincular cada cuenta con una wallet.
3.  Mostrar un catálogo de productos.
4.  Crear y aceptar pedidos.
5.  Registrar el ciclo de vida del pedido en un contrato inteligente.
6.  Permitir que el vendedor declare el pago recibido y la entrega
    realizada.
7.  Permitir que el comprador confirme la recepción.
8.  Mostrar el historial y métricas de reputación.
9.  Incorporar un asistente IA que consulte datos reales del marketplace
    sin controlar operaciones críticas.

### Definition of Done --- imprescindible para presentar

-   [ ] La aplicación se inicia y puede usarse desde el navegador.
-   [ ] Hay al menos una cuenta de comprador y una de vendedor.
-   [ ] Se puede conectar una wallet de testnet.
-   [ ] Hay productos de demostración visibles.
-   [ ] El comprador puede crear un pedido.
-   [ ] El vendedor puede aceptar el pedido.
-   [ ] El vendedor puede reportar que recibió el pago tradicional.
-   [ ] El vendedor puede marcar la entrega.
-   [ ] El comprador puede confirmar la recepción.
-   [ ] Los cambios de estado se registran en el contrato.
-   [ ] Se muestra el historial con enlaces o hashes de transacción.
-   [ ] La reputación se calcula a partir de datos del sistema.
-   [ ] La demo puede ejecutarse sin depender de servicios inestables.

**Regla de alcance:** si una función no ayuda a demostrar confianza
durante una compra completa, no es prioritaria para el MVP.

------------------------------------------------------------------------

## 3. Alcance funcional

### 3.1 Roles

  -----------------------------------------------------------------------
  Rol                                 Acciones
  ----------------------------------- -----------------------------------
  Comprador                           Explorar catálogo, crear pedido,
                                      consultar estado, confirmar
                                      recepción y ver historial

  Vendedor                            Publicar productos, aceptar
                                      pedidos, declarar pago recibido,
                                      marcar entrega y consultar métricas

  Administrador/demo                  Cargar datos de ejemplo y habilitar
                                      cuentas de prueba; no debe alterar
                                      registros on-chain
  -----------------------------------------------------------------------

### 3.2 Funciones imprescindibles

#### Identidad universitaria

-   Registro o inicio de sesión con correo institucional.
-   Validación de dominio permitido en el backend.
-   Vinculación de la cuenta con una dirección de wallet.
-   Etiqueta visual de "Estudiante verificado".
-   Para el hackathon se permite un flujo de correo simulado o código de
    demostración.

**No afirmar que existe integración oficial con la universidad** si no
se conectó realmente con su sistema de identidad. En producción se
requeriría OAuth, SSO o un mecanismo institucional autorizado.

#### Catálogo

Cada producto debe contener:

-   ID interno.
-   Nombre.
-   Descripción breve.
-   Precio en MXN.
-   Categoría.
-   Disponibilidad.
-   Wallet o usuario vendedor.
-   Punto general de entrega dentro del campus.

No solicitar ni mostrar direcciones particulares. Para la demo bastan
puntos generales como "Biblioteca", "Explanada" o "Facultad".

#### Pedidos

El comprador selecciona un producto y crea un pedido. El backend
almacena los detalles y genera un identificador y hash deterministas. El
contrato registra el ID, comprador, vendedor, hash y estado inicial.

#### Pago tradicional

El comprador paga directamente al vendedor en efectivo o transferencia.
El vendedor utiliza la aplicación para declarar que recibió el pago.

**Limitación que debe explicarse claramente:** el contrato registra la
declaración firmada por la wallet del vendedor; no comprueba de manera
independiente una transferencia bancaria ni la entrega física del
dinero. Por eso, en la interfaz usar "Pago reportado por vendedor" o
"Pago recibido declarado", nunca "Pago bancario verificado".

#### Entrega

El vendedor declara que entregó el producto. El comprador confirma que
lo recibió. Solo entonces el pedido se considera completado.

#### Historial verificable

Mostrar:

-   Estado actual.
-   Secuencia de eventos.
-   Fecha y hora.
-   Dirección que ejecutó cada acción.
-   Hash de transacción.
-   Enlace al explorador de bloques, si está disponible.

### 3.3 Funciones opcionales

Implementar solo si el flujo principal ya funciona:

-   Calificación de vendedor después de completar un pedido.
-   Filtros por categoría y precio.
-   Asistente IA para redactar descripciones.
-   Recomendaciones de productos.
-   Resumen explicativo de reputación.

### 3.4 Fuera del MVP

-   Pagos con criptomonedas.
-   Custodia de fondos o escrow.
-   Reembolsos automáticos.
-   Sistema de disputas.
-   Chat en tiempo real.
-   Aplicación móvil nativa.
-   Entrega a domicilio.
-   Integración real con sistemas universitarios.
-   Token propio.
-   Sistema complejo multiagente.
-   Almacenamiento de fotos o documentos personales en blockchain.

------------------------------------------------------------------------

## 4. Flujo completo de usuario

### Flujo A: alta y acceso

1.  El estudiante ingresa su correo institucional.
2.  El backend valida el dominio permitido o utiliza una cuenta de
    demostración.
3.  El usuario conecta su wallet.
4.  El backend asocia internamente el usuario con la dirección de
    wallet.
5.  La interfaz muestra su rol y estado de verificación.

### Flujo B: compra

1.  El comprador explora el catálogo.
2.  Selecciona un producto y revisa precio y punto de entrega.
3.  Confirma el pedido.
4.  El backend genera `orderId` y `orderHash`.
5.  La wallet del comprador llama a `createOrder` en el contrato.
6.  La aplicación espera confirmación de la transacción.
7.  El pedido aparece como `CREATED`.

### Flujo C: atención del pedido

1.  El vendedor abre sus pedidos pendientes.
2.  Acepta el pedido; su wallet llama a `acceptOrder`.
3.  El comprador paga en efectivo o transferencia fuera de la
    blockchain.
4.  El vendedor declara el pago recibido; su wallet llama a
    `reportPayment`.
5.  El vendedor entrega el producto y llama a `confirmDelivery`.
6.  El comprador recibe el producto y llama a `completeOrder`.
7.  El pedido queda `COMPLETED`.

### Flujo D: verificación

1.  La aplicación recupera el pedido desde el backend.
2.  Recalcula el hash del detalle usando exactamente el mismo formato.
3.  Consulta `verifyOrderHash` en el contrato.
4.  Muestra si el hash coincide.
5.  Muestra los eventos y transacciones asociados.

------------------------------------------------------------------------

## 5. Máquina de estados

Estados del contrato:

  -----------------------------------------------------------------------
  Estado                  Significado             Quién lo provoca
  ----------------------- ----------------------- -----------------------
  `CREATED`               Pedido creado           Comprador

  `ACCEPTED`              Vendedor aceptó         Vendedor

  `PAYMENT_REPORTED`      Vendedor declaró haber  Vendedor
                          recibido el pago        

  `DELIVERED`             Vendedor declaró que    Vendedor
                          entregó el producto     

  `COMPLETED`             Comprador confirmó la   Comprador
                          recepción               

  `CANCELLED`             Pedido cancelado antes  Comprador
                          de aceptación           
  -----------------------------------------------------------------------

Transiciones permitidas:

``` text
CREATED
  ├── ACCEPTED
  │     └── PAYMENT_REPORTED
  │             └── DELIVERED
  │                     └── COMPLETED
  └── CANCELLED
```

No permitir saltos de estado. Las funciones del contrato deben verificar
el estado anterior y el rol de quien llama.

------------------------------------------------------------------------

## 6. Arquitectura técnica

``` text
                         ┌─────────────────────────┐
                         │       React + Vite      │
                         │ Catálogo / Pedidos / UI │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
             ┌──────▼───────┐                   ┌───────▼────────┐
             │ Node + API   │                   │ MetaMask       │
             │ Auth / lógica│                   │ Wallet usuario │
             └──────┬───────┘                   └───────┬────────┘
                    │                                   │ ethers.js
             ┌──────▼───────┐                           │
             │ Firebase o   │                           │
             │ MongoDB      │                           │
             │ Productos y  │                           │
             │ detalles     │                           │
             └──────────────┘                           │
                                                        ▼
                                            ┌──────────────────────┐
                                            │ CampusChain.sol      │
                                            │ Estados / hashes /   │
                                            │ eventos de pedidos   │
                                            └──────────┬───────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │ Polkadot Hub EVM     │
                                            │ TestNet              │
                                            └──────────────────────┘

             Agente IA ───────► API de productos, pedidos y reputación
```

### Stack sugerido

  -----------------------------------------------------------------------
  Capa                    Tecnología              Uso
  ----------------------- ----------------------- -----------------------
  Frontend                React + Vite            Interfaz web

  Estilos                 Tailwind CSS            Diseño rápido

  Backend                 Node.js + Express       API y validación

  Base de datos           Firebase o MongoDB      Usuarios, productos y
                                                  pedidos

  Smart contract          Solidity                Estados y hashes

  Desarrollo contrato     Hardhat                 Compilar, probar y
                                                  desplegar

  Wallet                  MetaMask                Firmar transacciones

  Integración             ethers.js               Interacción con
                                                  contrato

  Red                     Polkadot Hub EVM        Ejecución del contrato
                          TestNet                 

  IA                      Un agente conectado al  Recomendaciones y
                          backend                 explicaciones
  -----------------------------------------------------------------------

**Decisión para ahorrar tiempo:** utilizar la base de datos que el
equipo ya conozca. No aprender una tecnología nueva durante el
hackathon.

------------------------------------------------------------------------

## 7. Diseño del smart contract

### Responsabilidad

El contrato es el registro de auditoría del pedido. No almacena el
catálogo completo, datos personales ni comprobantes de pago. Registra
participantes, hash, estado, timestamp y eventos.

### Datos on-chain

-   ID único del pedido (`bytes32`).
-   Wallet del comprador.
-   Wallet del vendedor.
-   Hash de los detalles (`bytes32`).
-   Estado.
-   Timestamp de creación.
-   Eventos de cambio de estado.

### Datos off-chain

-   Correo institucional.
-   Nombre y perfil.
-   Nombre y descripción del producto.
-   Imagen.
-   Punto general de entrega.
-   Detalles del pedido.
-   Calificaciones y comentarios.
-   Datos de contacto.

### Código base del contrato

El siguiente contrato es una base de MVP. Debe compilarse, probarse y
revisarse en el entorno elegido antes de desplegarse.

``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CampusChain {
    enum Status {
        CREATED,
        ACCEPTED,
        PAYMENT_REPORTED,
        DELIVERED,
        COMPLETED,
        CANCELLED
    }

    struct Order {
        address buyer;
        address seller;
        bytes32 orderHash;
        Status status;
        uint256 createdAt;
    }

    mapping(bytes32 => Order) public orders;

    event OrderCreated(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed seller,
        bytes32 orderHash
    );

    event OrderStatusChanged(
        bytes32 indexed orderId,
        Status newStatus,
        address changedBy,
        uint256 timestamp
    );

    modifier exists(bytes32 id) {
        require(orders[id].buyer != address(0), "Order not found");
        _;
    }

    modifier onlyBuyer(bytes32 id) {
        require(orders[id].buyer == msg.sender, "Not buyer");
        _;
    }

    modifier onlySeller(bytes32 id) {
        require(orders[id].seller == msg.sender, "Not seller");
        _;
    }

    function createOrder(
        bytes32 id,
        address seller,
        bytes32 orderHash
    ) external {
        require(orders[id].buyer == address(0), "ID already used");
        require(seller != address(0), "Invalid seller");
        require(seller != msg.sender, "Cannot buy from yourself");

        orders[id] = Order({
            buyer: msg.sender,
            seller: seller,
            orderHash: orderHash,
            status: Status.CREATED,
            createdAt: block.timestamp
        });

        emit OrderCreated(id, msg.sender, seller, orderHash);
        emit OrderStatusChanged(
            id, Status.CREATED, msg.sender, block.timestamp
        );
    }

    function acceptOrder(bytes32 id)
        external exists(id) onlySeller(id)
    {
        require(
            orders[id].status == Status.CREATED,
            "Invalid status"
        );
        _changeStatus(id, Status.ACCEPTED);
    }

    function reportPayment(bytes32 id)
        external exists(id) onlySeller(id)
    {
        require(
            orders[id].status == Status.ACCEPTED,
            "Invalid status"
        );
        _changeStatus(id, Status.PAYMENT_REPORTED);
    }

    function confirmDelivery(bytes32 id)
        external exists(id) onlySeller(id)
    {
        require(
            orders[id].status == Status.PAYMENT_REPORTED,
            "Invalid status"
        );
        _changeStatus(id, Status.DELIVERED);
    }

    function completeOrder(bytes32 id)
        external exists(id) onlyBuyer(id)
    {
        require(
            orders[id].status == Status.DELIVERED,
            "Invalid status"
        );
        _changeStatus(id, Status.COMPLETED);
    }

    function cancelOrder(bytes32 id)
        external exists(id) onlyBuyer(id)
    {
        require(
            orders[id].status == Status.CREATED,
            "Cannot cancel now"
        );
        _changeStatus(id, Status.CANCELLED);
    }

    function verifyOrderHash(bytes32 id, bytes32 hash)
        external view exists(id) returns (bool)
    {
        return orders[id].orderHash == hash;
    }

    function _changeStatus(bytes32 id, Status newStatus)
        internal
    {
        orders[id].status = newStatus;
        emit OrderStatusChanged(
            id, newStatus, msg.sender, block.timestamp
        );
    }
}
```

### Reglas de seguridad del contrato

-   Solo el comprador crea el pedido.
-   El vendedor no puede ser la misma wallet que el comprador.
-   Solo el vendedor puede aceptar, reportar pago y declarar entrega.
-   Solo el comprador puede confirmar la finalización.
-   Solo se permiten transiciones válidas.
-   Un ID no puede reutilizarse.
-   No se almacenan datos personales.
-   Las funciones deben probarse con wallets diferentes.

### Mejoras posteriores, no necesarias para el MVP

-   Pausa de emergencia.
-   Cancelación acordada por ambas partes.
-   Disputas y mediación.
-   Credenciales universitarias firmadas.
-   Calificación vinculada a un pedido completado.
-   Protección contra vendedores no autorizados mediante roles o
    credenciales verificables.

------------------------------------------------------------------------

## 8. Hash del pedido

El hash vincula el detalle guardado en la base de datos con el registro
on-chain. Si el contenido cambia, el hash recalculado debe dejar de
coincidir.

### Recomendación

Crear un objeto con campos y orden definidos. Evitar hashear JSON que
pueda serializarse de distintas maneras.

Ejemplo conceptual:

``` javascript
const orderPayload = {
  orderId: "CC-0001",
  productId: "PROD-001",
  quantity: 2,
  unitPriceCents: 3500,
  currency: "MXN",
  buyerWallet: buyerAddress.toLowerCase(),
  sellerWallet: sellerAddress.toLowerCase()
};
```

Con ethers.js:

``` javascript
import { keccak256, toUtf8Bytes } from "ethers";

const canonicalPayload = JSON.stringify(orderPayload);
const orderHash = keccak256(toUtf8Bytes(canonicalPayload));
```

**Importante:** todos los componentes que calculen el hash deben usar
exactamente la misma estructura, orden de campos, normalización de
direcciones y representación de números. Para un sistema de producción,
conviene definir una codificación canónica formal o usar `AbiCoder`.

No incluir correo, nombre, teléfono ni otros datos personales en el
contenido hasheado si existe riesgo de que puedan inferirse mediante
ataques de diccionario. Un hash no cifra la información.

------------------------------------------------------------------------

## 9. Integración frontend y blockchain

### Conexión de wallet

-   El usuario conecta MetaMask.
-   La aplicación obtiene la dirección activa.
-   Comprueba que la red sea la testnet configurada.
-   Si no coincide, solicita al usuario cambiar de red.
-   La wallet firma las transacciones; el backend nunca debe pedir ni
    almacenar la frase semilla o clave privada del usuario.

### Operaciones

  Acción de interfaz       Función del contrato   Wallet que firma
  ------------------------ ---------------------- ------------------
  Crear pedido             `createOrder`          Comprador
  Aceptar pedido           `acceptOrder`          Vendedor
  Reportar pago recibido   `reportPayment`        Vendedor
  Marcar entregado         `confirmDelivery`      Vendedor
  Confirmar recepción      `completeOrder`        Comprador
  Cancelar pedido nuevo    `cancelOrder`          Comprador

### Buenas prácticas de integración

1.  Esperar la confirmación de la transacción antes de actualizar la
    interfaz como exitosa.
2.  Mostrar estados de "pendiente", "confirmando" y "confirmado".
3.  Guardar el hash de transacción en la base de datos para consulta
    rápida.
4.  No confiar en que el backend diga que una transacción ocurrió:
    verificar el receipt o leer el contrato.
5.  Si falla una transacción, no marcar el pedido como completado.
6.  Evitar enviar varias transacciones por doble clic.

------------------------------------------------------------------------

## 10. Identidad universitaria

### MVP

-   Lista de dominios institucionales permitidos en backend.
-   Cuenta de prueba o código de verificación.
-   Vinculación de usuario con wallet.
-   Etiqueta de "Estudiante verificado" en la interfaz.

### Modelo de datos sugerido

``` json
{
  "userId": "user-001",
  "institutionalEmail": "estudiante@universidad.edu",
  "walletAddress": "0x...",
  "role": "seller",
  "verificationStatus": "demo_verified"
}
```

Este objeto se guarda **off-chain** y no debe exponerse públicamente
completo.

### Producción

La validación de dominio por sí sola no prueba que una persona sea
estudiante: se necesita controlar el proceso de verificación de correo o
integrar un proveedor institucional autorizado. También debe existir un
proceso para desvincular wallets perdidas o comprometidas.

------------------------------------------------------------------------

## 11. Reputación y confianza

### Indicadores del MVP

-   Pedidos completados.
-   Pedidos cancelados.
-   Tasa de finalización.
-   Calificación promedio, si se implementa.
-   Antigüedad de la cuenta, si está disponible.

Fórmula simple:

``` text
Tasa de finalización =
pedidos completados / pedidos aceptados * 100
```

Definir cómo se tratan pedidos cancelados y pedidos todavía abiertos. No
mostrar porcentaje si el vendedor tiene cero pedidos elegibles.

### Reglas

-   Solo contar pedidos con estado `COMPLETED`.
-   No permitir que el vendedor escriba sus propias métricas.
-   Una calificación solo puede asociarse a un pedido completado.
-   Evitar que un usuario califique varias veces el mismo pedido.
-   Mostrar cantidad de operaciones junto con el promedio para dar
    contexto.

**No presentar la reputación como garantía absoluta de honestidad.** Es
un indicador basado en el historial registrado.

------------------------------------------------------------------------

## 12. Agente de IA

### Nombre

**CampusChain Assistant**

### Objetivo

Ayudar a los estudiantes a descubrir productos y entender la información
de confianza del marketplace.

### Herramientas/API que puede consultar

-   Buscar productos.
-   Filtrar por precio y categoría.
-   Consultar perfil y métricas de un vendedor.
-   Consultar el estado de un pedido del usuario autenticado.
-   Generar una descripción sugerida para un producto.

### Ejemplos

**Comprador:** "Busco algo dulce por menos de 50 pesos."\
**Agente:** consulta el catálogo y recomienda productos que cumplen el
presupuesto.

**Comprador:** "¿Puedo confiar en esta vendedora?"\
**Agente:** resume datos observables: pedidos completados, cancelaciones
y calificaciones, indicando el tamaño de la muestra.

**Vendedor:** "Ayúdame a publicar mis brownies."\
**Agente:** propone un título y una descripción; el vendedor revisa y
confirma antes de publicar.

### Restricciones del agente

-   No inventar productos, precios, reseñas ni métricas.
-   No declarar que un pago está verificado.
-   No ejecutar transacciones blockchain.
-   No cambiar estados de pedidos.
-   No revelar información de otros usuarios.
-   Consultar la API y responder con los datos obtenidos.

La aplicación debe seguir funcionando si el servicio de IA falla.

------------------------------------------------------------------------

## 13. Diseño de interfaz

Pantallas mínimas:

1.  **Login:** correo universitario y conectar wallet.
2.  **Marketplace:** productos, filtros y búsqueda.
3.  **Detalle de producto:** precio, vendedor, reputación y punto de
    entrega.
4.  **Mis pedidos:** estados y acciones disponibles.
5.  **Panel de vendedor:** publicar producto y gestionar pedidos.
6.  **Perfil del vendedor:** identidad, métricas e historial resumido.
7.  **Detalle verificable:** línea de tiempo, wallets y transacciones.
8.  **Asistente IA:** consulta de productos y reputación.

### Prioridad visual

-   Interfaz limpia y rápida.
-   Estados de pedido fáciles de entender.
-   Etiqueta clara para identidad universitaria.
-   Diferenciar "pago reportado" de "pago verificado".
-   Mostrar evidencia blockchain sin abrumar al usuario.
-   Adaptación básica a pantalla móvil, aunque sea una web responsive.

------------------------------------------------------------------------

## 14. Modelo de datos off-chain

Esquema conceptual:

### Usuarios

``` json
{
  "id": "user-001",
  "email": "demo@universidad.edu",
  "wallet": "0x...",
  "role": "buyer",
  "verificationStatus": "demo_verified"
}
```

### Productos

``` json
{
  "id": "product-001",
  "sellerId": "user-002",
  "name": "Brownies",
  "description": "Brownies caseros",
  "priceCents": 3500,
  "currency": "MXN",
  "category": "food",
  "available": true,
  "pickupPoint": "Explanada"
}
```

### Pedidos

``` json
{
  "id": "CC-0001",
  "buyerId": "user-001",
  "sellerId": "user-002",
  "productId": "product-001",
  "quantity": 2,
  "totalCents": 7000,
  "currency": "MXN",
  "orderHash": "0x...",
  "contractStatus": "CREATED",
  "transactionHashes": [],
  "createdAt": "ISO-8601 timestamp"
}
```

Estos ejemplos son ilustrativos. En producción se deben validar
entradas, controlar acceso por usuario y no confiar en IDs
proporcionados por el cliente.

------------------------------------------------------------------------

## 15. API mínima sugerida

  Método   Ruta                            Uso
  -------- ------------------------------- ----------------------------------
  POST     `/api/auth/demo-login`          Acceso de demostración
  GET      `/api/products`                 Listar productos
  POST     `/api/products`                 Crear producto
  GET      `/api/products/:id`             Detalle de producto
  POST     `/api/orders`                   Crear registro off-chain inicial
  GET      `/api/orders/:id`               Consultar pedido
  GET      `/api/me/orders`                Pedidos del usuario
  GET      `/api/sellers/:id/reputation`   Métricas del vendedor
  POST     `/api/assistant`                Consultar agente IA

La API no debe simular una transacción on-chain exitosa. El frontend
envía o ejecuta la transacción con la wallet y posteriormente comunica
al backend el hash de transacción para su verificación.

Para el hackathon pueden reducir aún más las rutas y usar llamadas
directas desde el frontend a Firebase, siempre que las reglas de
seguridad impidan modificaciones arbitrarias.

------------------------------------------------------------------------

## 16. Distribución del equipo

### Equipo de cuatro

  -----------------------------------------------------------------------
  Integrante              Área                    Entregables
  ----------------------- ----------------------- -----------------------
  1                       Blockchain              Contrato, pruebas,
                                                  despliegue, ABI y
                                                  dirección

  2                       Frontend                Login, catálogo,
                                                  detalle, pedidos e
                                                  historial

  3                       Backend + IA            Datos, API,
                                                  autenticación, métricas
                                                  y agente

  4                       Integración + UX        Conexión de wallet,
                                                  flujo de compra,
                                                  pruebas, diseño y pitch
  -----------------------------------------------------------------------

### Equipo de tres

-   Integrante 1: contrato y conexión blockchain.
-   Integrante 2: frontend y experiencia de usuario.
-   Integrante 3: backend, base de datos y agente IA.

En equipo de tres, reduzcan el agente IA a una búsqueda asistida
sencilla y eviten funciones opcionales.

### Contratos entre integrantes

A los 30 minutos deben acordar:

-   Nombre y tipo de cada función del contrato.
-   Estructura de datos de pedido.
-   Formato de `orderId` y `orderHash`.
-   Dirección de contrato y ABI compartidas.
-   Forma de comunicar errores y estados.
-   Contratos de API y nombres de campos.

No esperen a que cada parte esté terminada para integrarlas.

------------------------------------------------------------------------

## 17. Cronograma de cinco horas

  -----------------------------------------------------------------------
  Tiempo                  Objetivo                Resultado verificable
  ----------------------- ----------------------- -----------------------
  00:00--00:30            Setup y acuerdos        Repositorio, entorno,
                                                  interfaces y cuentas de
                                                  prueba

  00:30--01:30            Desarrollo paralelo     Contrato inicial,
                                                  catálogo, API y datos
                                                  semilla

  01:30--02:30            Despliegue e            Wallet conectada y
                          integración             creación/aceptación de
                                                  pedido

  02:30--03:30            Confianza e IA          Pago reportado,
                                                  entrega, confirmación e
                                                  historial

  03:30--04:30            Pruebas integrales      Compra completa
                                                  ejecutada y errores
                                                  críticos corregidos

  04:30--05:00            Pitch y ensayo          Demo reproducible y
                                                  presentación lista
  -----------------------------------------------------------------------

### Hitos obligatorios

**Minuto 30:** interfaces y responsabilidades acordadas.\
**Minuto 90:** contrato compilado y frontend/backend con datos
visibles.\
**Minuto 150:** contrato desplegado y al menos una transacción desde la
aplicación.\
**Minuto 210:** flujo de compra casi completo.\
**Minuto 270:** congelar funciones y corregir errores.\
**Minuto 300:** presentar.

### Regla de contingencia

Si la red de testnet, faucet o RPC falla:

1.  No perder más de 10--15 minutos intentando resolverlo.
2.  Probar con una red local EVM para continuar el desarrollo.
3.  Mantener la integración de testnet como objetivo de demostración.
4.  Ser transparentes: no afirmar que se desplegó en Polkadot si no
    ocurrió.

------------------------------------------------------------------------

## 18. Pruebas necesarias

### Pruebas del contrato

-   [ ] Un comprador puede crear un pedido.
-   [ ] No se puede reutilizar un ID.
-   [ ] El vendedor puede aceptar.
-   [ ] Un tercero no puede aceptar.
-   [ ] El vendedor puede reportar el pago después de aceptar.
-   [ ] No se puede reportar pago antes de aceptar.
-   [ ] El vendedor puede marcar entrega después del pago reportado.
-   [ ] El comprador puede completar después de la entrega.
-   [ ] Un tercero no puede completar.
-   [ ] No se puede completar dos veces.
-   [ ] El hash correcto devuelve `true`.
-   [ ] Un hash alterado devuelve `false`.
-   [ ] Solo se cancela un pedido en estado `CREATED`.

### Pruebas de aplicación

-   [ ] Un usuario sin sesión no puede consultar datos privados.
-   [ ] Un vendedor no puede modificar pedidos de otro vendedor.
-   [ ] El comprador no puede ejecutar acciones exclusivas del vendedor.
-   [ ] Un fallo de transacción no cambia la interfaz a estado exitoso.
-   [ ] La reputación se calcula desde pedidos completados.
-   [ ] La IA solo utiliza información devuelta por la API.

------------------------------------------------------------------------

## 19. Seguridad y privacidad

-   No almacenar claves privadas ni frases semilla.
-   No poner correos, nombres, teléfonos ni datos personales en el
    contrato.
-   No colocar comprobantes bancarios en blockchain.
-   No guardar datos personales dentro de hashes si pueden inferirse.
-   Validar los permisos en backend y contrato.
-   No confiar en el rol enviado por el frontend; verificarlo en
    backend.
-   Usar wallets de prueba y fondos de testnet.
-   Proteger endpoints y reglas de base de datos.
-   No incluir secretos o API keys en el repositorio.
-   No afirmar que blockchain elimina fraude: aporta trazabilidad y
    resistencia a modificaciones, pero no garantiza que las
    declaraciones iniciales sean verdaderas.

------------------------------------------------------------------------

## 20. Preparación técnica antes del hackathon

Si el reglamento permite preparación previa, dejen listo:

-   [ ] Repositorio y estructura de carpetas.
-   [ ] Proyecto React y backend ejecutándose.
-   [ ] Hardhat instalado.
-   [ ] Contrato compilado y pruebas básicas.
-   [ ] ABI disponible para frontend.
-   [ ] MetaMask instalada en equipos de demo.
-   [ ] Red y faucet oficiales identificados.
-   [ ] Wallets de prueba creadas y financiadas.
-   [ ] Productos y usuarios de demostración.
-   [ ] Plantilla de pitch y diagrama de arquitectura.
-   [ ] Variables de entorno documentadas.

Antes del evento, confirmen en la documentación oficial los parámetros
vigentes de Polkadot Hub EVM TestNet: RPC, chain ID, moneda de gas,
explorador y faucet. No copien parámetros de tutoriales antiguos.

------------------------------------------------------------------------

## 21. Estructura sugerida del repositorio

``` text
campuschain/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── contracts/
│   ├── contracts/
│   │   └── CampusChain.sol
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
├── docs/
│   ├── architecture.md
│   └── demo-script.md
├── .env.example
└── README.md
```

------------------------------------------------------------------------

## 22. Demo para los jueces

### Historia

Ana vende brownies dentro de la universidad. Carlos quiere comprar uno y
desea saber si puede confiar en la vendedora.

### Secuencia de demostración (2--3 minutos)

1.  Ana inicia sesión con su correo universitario de demostración.
2.  Ana conecta su wallet y publica brownies.
3.  Carlos entra con su cuenta y wallet.
4.  Carlos pregunta al asistente por opciones de menos de \$50.
5.  El asistente recomienda el producto con datos reales.
6.  Carlos crea el pedido; se muestra la transacción de creación.
7.  Ana acepta el pedido.
8.  Carlos paga por el medio tradicional acordado.
9.  Ana declara el pago recibido.
10. Ana marca el pedido como entregado.
11. Carlos confirma que recibió el producto.
12. Se muestra el historial on-chain y la reputación de Ana.

### Qué debe verse en pantalla

-   Correo universitario de demostración y wallet vinculada.
-   Producto y precio.
-   Estados del pedido.
-   Hashes de transacción.
-   Historial ordenado.
-   Métricas del vendedor.
-   Verificación del hash del pedido.

Preparar un pedido de respaldo ya completado, pero demostrar también una
operación en vivo si la red responde.

------------------------------------------------------------------------

## 23. Pitch sugerido

### Versión de 45--60 segundos

"Dentro de las universidades, cientos de estudiantes venden productos y
servicios, pero gran parte de ese comercio ocurre de manera informal, a
través de grupos y recomendaciones. Eso hace difícil conocer el
historial de un vendedor y dar seguimiento confiable a una compra.

CampusChain es una plataforma de comercio universitario que vincula la
identidad institucional con una wallet y registra en blockchain las
etapas importantes de cada pedido. Los pagos siguen siendo
tradicionales: lo que registramos es quién declaró recibir el pago,
quién declaró entregar el producto y cuándo el comprador confirmó la
recepción.

Así construimos un historial verificable y una reputación basada en
operaciones completadas. No buscamos reemplazar los marketplaces
existentes; buscamos proporcionar una capa de confianza para comunidades
universitarias."

### Frase final

**"CampusChain: el comercio universitario se construye con confianza
verificable."**

------------------------------------------------------------------------

## 24. Preguntas difíciles de los jueces

### ¿Por qué necesitan blockchain?

Porque las partes pueden consultar un registro compartido de eventos y
verificar que el historial registrado no fue modificado unilateralmente
después. Una base de datos tradicional puede ser suficiente para muchos
marketplaces; nuestra justificación es la auditoría compartida entre
comprador y vendedor.

### ¿Blockchain comprueba que el vendedor recibió el dinero?

No. En el MVP el pago es tradicional y el vendedor firma una declaración
de recepción con su wallet. La blockchain registra quién hizo esa
declaración y cuándo. No es una confirmación bancaria.

### ¿Cómo saben que los usuarios son estudiantes?

El MVP usa verificación institucional de demostración y vinculación a
wallet. Una versión de producción requeriría integrar un sistema de
identidad universitaria autorizado.

### ¿Qué pasa si el vendedor marca como entregado sin entregar?

El comprador debe confirmar la recepción para completar el pedido. El
sistema conserva el evento de declaración del vendedor, pero no puede
verificar físicamente la entrega. En una versión posterior se podrían
agregar disputas, evidencia o mediación.

### ¿Qué pasa si alguien cambia el pedido en la base de datos?

La aplicación recalcula el hash del detalle y lo compara con el hash
registrado en el contrato. Si el contenido cambia, la verificación
falla.

### ¿Qué pasa si un estudiante pierde su wallet?

La cuenta debe contar con un proceso de recuperación y desvinculación de
wallet. En el MVP, las cuentas son de demostración; en producción se
necesita un diseño de recuperación seguro.

### ¿Cómo escalaría?

A otras universidades, ferias estudiantiles, comunidades de
emprendedores y redes locales de comercio. El modelo puede adaptarse a
distintas instituciones mediante políticas de identidad y despliegues
compatibles.

### ¿Cuál es la innovación?

La combinación de identidad universitaria, trazabilidad de pedidos y
reputación basada en acciones registradas, no simplemente la publicación
de productos.

------------------------------------------------------------------------

## 25. Riesgos y mitigaciones

  -----------------------------------------------------------------------
  Riesgo                              Mitigación
  ----------------------------------- -----------------------------------
  Testnet o faucet no disponible      Preparar wallets y probar con
                                      anticipación; tener entorno local
                                      de respaldo

  Integración tardía                  Definir ABI, funciones y modelos
                                      desde los primeros 30 minutos

  Agente IA falla                     Mantener el flujo de compra
                                      independiente de IA

  Hash no coincide                    Definir serialización canónica y
                                      pruebas compartidas

  Wallet equivocada                   Mostrar dirección activa y
                                      comprobar roles

  Transacción pendiente               Mostrar estado pendiente; esperar
                                      receipt

  Alcance excesivo                    Congelar funciones a las 3 h 30 min

  Datos sensibles expuestos           Mantener PII fuera de blockchain y
                                      limitar acceso en backend

  Demo sin fondos                     Financiar wallets de prueba antes
                                      de comenzar
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 26. Qué haría que CampusChain destaque

1.  **Demostrar blockchain de verdad:** no solo mostrar una etiqueta o
    una animación; enseñar una transacción real y un evento verificable.
2.  **Explicar el problema con precisión:** la confianza y la
    trazabilidad son el núcleo, no la venta de brownies.
3.  **Ser honesto con las limitaciones:** pago reportado no significa
    pago bancario verificado.
4.  **Tener una experiencia completa:** una compra desde la publicación
    hasta la confirmación final.
5.  **Mostrar reputación con evidencia:** estadísticas ligadas a pedidos
    completados.
6.  **Usar IA con propósito:** que consulte datos reales y facilite
    decisiones.
7.  **Presentar una ruta de crecimiento creíble:** más universidades y
    comunidades, sin prometer una adopción inmediata.

### Prioridad absoluta

Si el tiempo se agota, el orden de sacrificio debe ser:

1.  Quitar funciones secundarias de IA.
2.  Quitar filtros avanzados y personalización.
3.  Simplificar la autenticación a cuentas de demostración.
4.  Simplificar el diseño visual.
5.  **No quitar el flujo completo del pedido ni el registro
    blockchain**, porque son el corazón de la propuesta.

------------------------------------------------------------------------

## 27. Checklist final del equipo

### Producto

-   [ ] Catálogo con productos de ejemplo.
-   [ ] Cuenta de comprador.
-   [ ] Cuenta de vendedor.
-   [ ] Perfil con estado de verificación.
-   [ ] Crear pedido.
-   [ ] Aceptar pedido.
-   [ ] Reportar pago tradicional.
-   [ ] Marcar entrega.
-   [ ] Confirmar recepción.
-   [ ] Historial verificable.

### Blockchain

-   [ ] Contrato compilado.
-   [ ] Pruebas de permisos.
-   [ ] Contrato desplegado.
-   [ ] ABI y dirección configuradas.
-   [ ] Wallets con gas de testnet.
-   [ ] Transacciones visibles.
-   [ ] Hash del pedido verificable.

### IA

-   [ ] Consulta catálogo.
-   [ ] Explica métricas reales.
-   [ ] No inventa datos.
-   [ ] No controla estados críticos.

### Presentación

-   [ ] Pitch practicado.
-   [ ] Demo de 2--3 minutos.
-   [ ] Pedido de respaldo.
-   [ ] Explorador listo.
-   [ ] Roles de presentación definidos.
-   [ ] Limitaciones explicadas con honestidad.

------------------------------------------------------------------------

## 28. Referencias técnicas que deben consultar

Usen documentación oficial y verifiquen versiones y parámetros actuales
antes del despliegue:

-   Polkadot Developer Docs: https://docs.polkadot.com/
-   Polkadot Hub: https://polkadot.com/
-   Solidity Documentation: https://docs.soliditylang.org/
-   Hardhat Documentation: https://hardhat.org/docs
-   ethers.js Documentation: https://docs.ethers.org/
-   MetaMask Developer Documentation: https://docs.metamask.io/
-   React Documentation: https://react.dev/
-   Vite Documentation: https://vite.dev/guide/

------------------------------------------------------------------------

## Conclusión

CampusChain debe demostrar una idea sencilla pero sólida: **una compra
universitaria puede tener un historial verificable, vinculado a las
wallets de las personas que participaron y respaldado por un contrato
inteligente**.

No intenten resolver todos los problemas del comercio universitario en
cinco horas. Construyan una experiencia pequeña, completa y técnicamente
honesta. Un pedido que se crea, acepta, reporta como pagado, se entrega
y se confirma en blockchain será una demostración mucho más convincente
que diez funcionalidades incompletas.
