'use strict';

const fs = require('fs');
const mediator = require('./index');
const net = require('net');
const tap = require('tap');

const xml = fs.readFileSync('rfc3881.xml', 'utf-8');
const audit = `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${xml}`;

tap.test('Main integration test', function(t) {
  mediator.startMediator(() => {
    // start test upstream server
    let server = net.createServer((socket) => {
      console.log('connected to test upstream');
      socket.on('data', (buffer) => {
        t.equal(buffer.toString(), fs.readFileSync('dicom.xml', 'utf-8'));
        t.end();
      });
    }).listen(6262, () => {
      console.log('Test upstream server listening...');
      // send test rfc3881 message
      let client = net.connect(6161, () => {
        client.write(audit);
        client.on('end', () => {
          client.end();
          mediator.stopMediator(() => {
            server.close();
          });
        });
      });
    });
  });
});
