'use strict';

const fs = require('fs');
const net = require('net');

const rfc3881 = fs.readFileSync('rfc3881.xml', 'utf-8');
const audit =    `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${rfc3881}`;

let client = net.connect(6161, () => {
  client.write(audit);
  client.on('end', () => {
    client.end();
  });
});
