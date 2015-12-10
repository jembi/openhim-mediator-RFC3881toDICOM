[![Build Status](https://travis-ci.org/jembi/openhim-mediator-RFC3881toDICOM.svg)](https://travis-ci.org/jembi/openhim-mediator-RFC3881toDICOM)

OpenHIM Mediator for converting RFC 3881 audits to DICOM
========================================================

Converts RFC3881 audit messages to DICOM. This mediator exposes a tcp server
where you can send ATNA audits to and it will convert these to the DICOM format.

It can also be used as a standalone js library.

If either of those don't suit your needs, just grab the XSLT and that performs
the XML transform and use that is your code.

Getting started
---------------

```
npm install --save openhim-mediator-rfc3881todicom
```

Run using `npm start`

This will expose a tcp server on port 6161. Now, forward it some audits. It will
forward these to an upstream server on port 6262 by default.

API reference
-------------

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
