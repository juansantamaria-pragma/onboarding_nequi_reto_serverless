'use strict';
const index = require('../../index.js');

const loadEvent = (name) =>
  JSON.parse(JSON.stringify(require(`../events/${name}.json`)));

// Trazabilidad: la lambda genera un traceID y lo loguea en entrada y en error.
// Evento inválido → falla en validación (no toca AWS), pero igual loguea traza.
describe('reto_serverless: trazabilidad (traceID en logs)', () => {

  let logs;
  let originalLog;

  beforeEach(() => {
    logs = [];
    originalLog = console.log;
    console.log = (...args) => { logs.push(args.join(' ')); };
  });

  afterEach(() => { console.log = originalLog; });

  it('loguea un traceID en la entrada y en el error', async () => {
    await index.handler(loadEvent('empty'), {});

    const traceLines = logs.filter((l) => l.includes('trace:'));
    expect(traceLines.length).toBeGreaterThan(0);
    expect(traceLines.some((l) => l.includes('entrada'))).toBe(true);
    expect(traceLines.some((l) => l.includes('error'))).toBe(true);
  });
});
