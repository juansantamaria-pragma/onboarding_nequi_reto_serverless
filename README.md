# reto_serverless — Onboarding Nequi

Lambda que consulta un parámetro de configuración en DynamoDB. La petición usa el
envelope de mensajería de Nequi (`RequestMessage`) y en el body lleva un `key` y
una `region`; la función devuelve el item que corresponde en la tabla
`nequi-parameters-qa`.

Lo que se consulta lo decide cada petición, no está fijo en el código.

## Petición

```json
{
  "RequestMessage": {
    "RequestHeader": {
      "Channel": "MF-001",
      "RequestDate": "2017-03-07T19:01:31.438Z",
      "MessageID": "913291938",
      "ClientID": "3195414070",
      "Destination": {
        "ServiceName": "ExampleService",
        "ServiceOperation": "test",
        "ServiceRegion": "C001",
        "ServiceVersion": "1.0.0"
      }
    },
    "RequestBody": {
      "any": {
        "parametersRQ": { "key": "onboardingTest", "region": "C001" }
      }
    }
  }
}
```

## Cómo está armada

El código está separado en capas simples:

```
index.js  →  handler  →  business  →  service (DynamoDB)
```

- **handler**: valida que lleguen `key` y `region`, y arma la respuesta.
- **business**: pasa la petición al service.
- **service**: hace el `getItem` sobre la tabla con `@nequi/nequi-aws-dynamodb`.

Si falta `key` o `region`, la validación corta antes de llegar a DynamoDB y
responde `BAD_PARAMETERS`.

Cada petición genera un `traceID` propio que aparece en los logs de entrada y de
error, para poder seguir una misma ejecución de punta a punta.

## Configuración

Las credenciales de AWS van en un archivo `.env` (no se sube al repo). Copiá la
plantilla y completá los valores:

```bash
cp .env.example .env
```

```
PARAMETERS_TABLE=nequi-parameters-qa
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...
```

## Pruebas automáticas

Corren con Jasmine y hacen un **llamado real** a la lambda (`index.handler`)
contra la tabla en QA. Por eso necesitan el `.env` con credenciales vigentes:

```bash
npm test
```

Los casos de validación (petición incompleta) no tocan AWS; los casos `valid` y
`not-found` sí consultan DynamoDB.

## Probar a mano (trigger node)

Cada caso es un archivo JSON en `test/events/`. Se le pasa al handler como
petición. Los casos de datos incompletos no necesitan credenciales; `valid` y
`not-found` sí consultan la tabla real de QA.

**Petición válida** → `SUCCESS (0)` + item:
```bash
node -e "require('./index').handler(require('./test/events/valid.json')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>console.error('FAIL:',JSON.stringify(e,null,2)))"
```

**Falta `region`** → `BAD_PARAMETERS (20-05A)`:
```bash
node -e "require('./index').handler(require('./test/events/missing-region.json')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>console.error('FAIL:',JSON.stringify(e,null,2)))"
```

**Falta `key`** → `BAD_PARAMETERS (20-05A)`:
```bash
node -e "require('./index').handler(require('./test/events/missing-key.json')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>console.error('FAIL:',JSON.stringify(e,null,2)))"
```

**Petición vacía** → `BAD_PARAMETERS (20-05A)`:
```bash
node -e "require('./index').handler(require('./test/events/empty.json')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>console.error('FAIL:',JSON.stringify(e,null,2)))"
```

**Parámetro que no existe** → `DATA_NOT_FOUND (20-08A)`:
```bash
node -e "require('./index').handler(require('./test/events/not-found.json')).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>console.error('FAIL:',JSON.stringify(e,null,2)))"
```
