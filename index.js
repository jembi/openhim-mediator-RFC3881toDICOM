#!/usr/bin/env node
'use strict';

const fs = require('fs');
const libxslt = require('libxslt');
const net = new require('net');
const glossy = require('glossy');
const syslogParser = glossy.Parse;
const syslogProducer = new glossy.Produce();
const utils = require('openhim-mediator-utils');

// Config
var config; // this will vary depending on whats set in openhim-core
const apiConf = require('./config/config');
const mediatorConfig = require('./config/mediator');

exports.convertRFC3881toDICOM = (xml, callback) => {
  const transform = fs.readFileSync(__dirname + '/rfc3881toDICOM.xslt', 'utf-8');
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
          const client = net.connect(config.upstreamPort, config.upstreamHost, () => {
            parsedMsg.message = dicom;
            syslogProducer.produce(parsedMsg, (msg) => {
              client.end(msg);
              socket.end();
            });
          });
        });
      });
    });
  }).listen(6161, callback);
};

exports.stopMediator = (callback) => {
  server.close(callback);
};

// default to config from mediator registration
var standalone = false;
if (process.argv.length >= 3 && process.argv[2].indexOf('--conf=') >= 0) {
  let confFile = process.argv[2].substr(7);
  config = require(confFile);
  standalone = true;
} else {
  config = mediatorConfig.config;
}

// start automatically if run directly
if (!module.parent) {
  if (!standalone && apiConf.register) {
    // openhim-mediator start-up procedure
    utils.registerMediator(apiConf.api, mediatorConfig, (err) => {
      if (err) {
        console.log('Failed to register this mediator, check your config');
        console.log(err.stack);
        process.exit(1);
      }
      apiConf.api.urn = mediatorConfig.urn;
      utils.fetchConfig(apiConf.api, (err, newConfig) => {
        console.log('Received initial config:');
        console.log(JSON.stringify(newConfig));
        config = newConfig;
        if (err) {
          console.log('Failed to fetch initial config');
          console.log(err.stack);
          process.exit(1);
        } else {
          console.log('Successfully registered mediator!');
          exports.startMediator(() => console.log('rfc3881toDICOM Medaitor listening on 6161...') );
          let configEmitter = utils.activateHeartbeat(apiConf.api);
          configEmitter.on('config', (newConfig) => {
            console.log('Received updated config:');
            console.log(JSON.stringify(newConfig));
            config = newConfig;
          });
        }
      });
    });
  } else {
    // startup standalone
    console.log('Starting in standalone mode.');
    exports.startMediator(() => console.log('rfc3881toDICOM Medaitor listening on 6161...') );
  }
}
