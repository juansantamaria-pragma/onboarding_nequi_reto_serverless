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

Como `traceID` se usa el `MessageID` de la petición (`RequestHeader.MessageID`),
que aparece en los logs de entrada y de error para seguir una misma ejecución de
punta a punta.

## Configuración

No se usa `.env`. La configuración local sale de dos fuentes, sin credenciales en el
repo:

- **Credenciales AWS** → por SSO. El SDK las toma del cache en `~/.aws`:

  ```powershell
  $env:AWS_PROFILE = "<tu-profile>"
  aws sso login --profile <tu-profile>
  ```

- **Config de entorno** (`PARAMETERS_TABLE`, `AWS_REGION`, logger flags) → desde
  `settings.json`, inyectada en la sesión con el script `envGet`:

  ```powershell
  env = ['qa' , 'dev' , 'pdn']
  envGet -env ":env[n]"
  ```

  `envGet` corre `nequi-ci getenvivar` sobre `settings.json` y setea las variables como
  `$env:` en la sesión actual. Ejecutalo **desde la raíz del proyecto**.

## Pruebas automáticas

Corren con Jasmine y hacen un **llamado real** a la lambda (`index.handler`) contra la
tabla en QA. Necesitan la sesión preparada (SSO + `envGet -env "qa"`) en la misma
terminal:

```powershell
npm test
```

Los casos de validación (petición incompleta) no tocan AWS; los casos `valid` y
`not-found` sí consultan DynamoDB.

> **`ExpiredTokenException` al correr `npm test`** → no es un fallo del código, es la
> sesión SSO vencida. Refrescala y volvé a correr:
>
> ```powershell
> aws sso login --profile <tu-profile>
> ```

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
