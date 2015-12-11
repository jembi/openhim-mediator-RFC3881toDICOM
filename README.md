[![Build Status](https://travis-ci.org/jembi/openhim-mediator-RFC3881toDICOM.svg)](https://travis-ci.org/jembi/openhim-mediator-RFC3881toDICOM) [![codecov.io](https://codecov.io/github/jembi/openhim-mediator-RFC3881toDICOM/coverage.svg?branch=master)](https://codecov.io/github/jembi/openhim-mediator-RFC3881toDICOM?branch=master)

OpenHIM Mediator for converting RFC 3881 audits to DICOM
========================================================

Converts RFC3881 audit messages to DICOM. This mediator exposes a tcp server
where you can send ATNA audits to and it will convert these to the DICOM format.

It can also be used as a standalone js library if you don't need tcp servers.

If either of those don't suit your needs, just grab the XSLT that performs
the XML transform and use that in own your code.

Getting started
---------------

```
npm install rfc3881todicom -g
```

### To run as an OpenHIM mediator

Run using `$ rfc3881todicom`

(if you are using a self-signed OpenHIM certificate you may need to run
`$ NODE_TLS_REJECT_UNAUTHORIZED=0 rfc3881todicom`)

This will expose a tcp server on port 6161. Now, forward it some audits. It will
forward these to an upstream server on port localhost:6262 by default.

It will also register the mediator with the OpenHIM on startup and setup config
syncing from the OpenHIM. You may configure the address where the transformed
audits are sent in OpenHIM console, under the rfc3881toDICOM mediator settings.

### To run standalone (without the OpenHIM)

Create a `config.json` file as follow:

```
{
  "upstreamHost": "localhost",
  "upstreamPort": 6262
}
```

Run with: `$ rfc3881todicom --conf=/path/to/config.json`

This will expose a tcp server on port 6161. Now, forward it some audits. It will
forward these to the upstream server that you setup in `config.json`.

API reference form use as a lib
-------------------------------

`$ npm install rfc3881todicom --save`

```
const audits = require('openhim-mediator-rfc3881todicom');

// XML is a string of the rfc3881 formated XML and the callback return a string
// with the corresponding DICOM formatted XML.
audits.convertRFC3881toDICOM(xml, function (err, dicom) {
  console.log(dicom);
}
```

Tests
-----

Run test by running `npm test`

Contribute
----------

Fork, commit, push and open a PR :)
