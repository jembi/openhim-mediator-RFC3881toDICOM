'use strict';

const fs = require('fs');
const libxslt = require('libxslt');
const net = new require('net');
const syslogParser = require('glossy').Parse;

exports.convertRFC3881toDICOM = (xml, callback) => {
  const transform = fs.readFileSync('rfc3881toDICOM.xslt', 'utf-8');
  libxslt.parse(transform, (err, stylesheet) => {
    stylesheet.apply(xml, (err, result) => {
      if (err) {
        callback(err);
      }
      callback(null, result);
    });
  });
};

let server = null;

exports.startMediator = (callback) => {
  server = net.createServer((socket) => {
    socket.on('data', (msg) => {
      syslogParser.parse(msg, (parsedMsg) => {
        let xml = parsedMsg.message;
        exports.convertRFC3881toDICOM(xml, (err, dicom) => {
          const client = net.connect(6262, () => {
            client.end(dicom);
            socket.end();
          });
        });
      });
    });
  }).listen(6161, callback);
};

exports.stopMediator = (callback) => {
  server.close(callback);
};

if (!module.parent) {
  exports.startMediator(() => console.log('rfc3881toDICOM Medaitor listening on 6161...') );
}
