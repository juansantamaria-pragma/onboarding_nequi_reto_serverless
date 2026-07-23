'use strict';
const index = require('../../index.js');

const loadEvent = (name) =>
  JSON.parse(JSON.stringify(require(`../events/${name}.json`)));

// Trazabilidad: la lambda genera un traceID y lo loguea en entrada y en error.
// Evento inválido → falla en validación (no toca AWS), pero igual loguea traza.
describe('reto_serverless: trazabilidad (traceID en logs)', () => {

  let traceLines;
  let originalLog;

  beforeEach(async () => {
    const logs = [];
    originalLog = console.log;
    console.log = (...args) => { logs.push(args.join(' ')); };

    await index.handler(loadEvent('empty'), {});

    console.log = originalLog;
    traceLines = logs.filter((l) => l.includes('trace:'));
  });

  afterEach(() => { console.log = originalLog; });

  it('loguea un traceID en la entrada', () => {
    expect(traceLines.some((l) => l.includes('entrada'))).toBe(true);
  });

  it('loguea un traceID en el error', () => {
    expect(traceLines.some((l) => l.includes('error'))).toBe(true);
  });
});
