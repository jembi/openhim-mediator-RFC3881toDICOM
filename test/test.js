'use strict';

const dgram = require('dgram');
const fs = require('fs');
const mediator = require('../index');
const net = require('net');
const tap = require('tap');

const config = require('../config/config');
config.register = false;

const rfc3881 = fs.readFileSync('test/rfc3881.xml', 'utf-8');
const dicom = fs.readFileSync('test/dicom.xml', 'utf-8');

const audit =    `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${rfc3881}`;
const expected = `<85>1 2015-12-10T09:42:24.129Z ryan-Latitude-E6540 atna-audit.js 19381 IHE+RFC-3881 - ${dicom}`;

tap.test('should convert audits received over TCP', function(t) {
  mediator.startMediator(() => {
    // start test upstream server
    let server = net.createServer((socket) => {
      console.log('connected to test upstream');
      socket.on('data', (buffer) => {
        t.equal(buffer.toString(), `${expected.length} ${expected}`);
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
            t.end();
          });
        });
      });
    });
  });
});

tap.test('should convert audits received over UDP', function(t) {
  mediator.startMediator(() => {
    // start test upstream server
    let server = net.createServer((socket) => {
      console.log('connected to test upstream');
      socket.on('data', (buffer) => {
        t.equal(buffer.toString(), `${expected.length} ${expected}`);
        mediator.stopMediator(() => {
          server.close();
          t.end();
        });
      });
    }).listen(6262, () => {
      console.log('Test upstream server listening...');
      // send test rfc3881 message
      let client = dgram.createSocket('udp4');
      let buf = new Buffer(audit);
      client.send(buf, 0, buf.length, 6363, 'localhost', () => {
        client.close();
      });
    });
  });
});

tap.test('should function as standalone lib', function(t) {
  mediator.convertRFC3881toDICOM(rfc3881, (err, output) => {
    if (err) {
      return t.fail('Error returned', err);
    }
    t.equal(output, dicom);
    t.end();
  });
});

const openxdsQuery = fs.readFileSync('test/openxds-query.xml', 'utf-8');
const expectedQuery = fs.readFileSync('test/valid-query.xml', 'utf-8');

tap.test('should correct OpenXDS query audit (ITI-18)', function(t) {
  mediator.convertRFC3881toDICOM(openxdsQuery, (err, output) => {
    if (err) {
      return t.fail('Error returned', err);
    }
    t.equal(output, expectedQuery);
    t.end();
  });
});

const openxdsImport = fs.readFileSync('test/openxds-import.xml', 'utf-8');
const expectedImport = fs.readFileSync('test/valid-import.xml', 'utf-8');

tap.test('should correct OpenXDS import audit (ITI-42)', function(t) {
  mediator.convertRFC3881toDICOM(openxdsImport, (err, output) => {
    if (err) {
      return t.fail('Error returned', err);
    }
    t.equal(output, expectedImport);
    t.end();
  });
});
