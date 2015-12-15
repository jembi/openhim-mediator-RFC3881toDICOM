'use strict';

const fs = require('fs');
const mediator = require('./index');
const net = require('net');
const tap = require('tap');

const config = require('./config/config');
config.register = false;

const rfc3881 = fs.readFileSync('rfc3881.xml', 'utf-8');
const dicom = fs.readFileSync('dicom.xml', 'utf-8');

const audit =    `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${rfc3881}`;
const expected = `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${dicom}`;

tap.test('Main integration test', function(t) {
  mediator.startMediator(() => {
    // start test upstream server
    let server = net.createServer((socket) => {
      console.log('connected to test upstream');
      socket.on('data', (buffer) => {
        t.equal(buffer.toString(), `${expected.length} ${expected}`);
        t.end();
      });
    }).listen(6262, () => {
      console.log('Test upstream server listening...');
      // send test rfc3881 message
      let client = net.connect(6161, () => {
        client.write(`${audit.length} ${audit}`);
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

tap.test('Use as standalone lib', function(t) {
  mediator.convertRFC3881toDICOM(rfc3881, (err, dicom) => {
    if (err) {
      return t.fail('Error returned', err);
    }
    t.equal(dicom, dicom);
    t.end();
  });
});
