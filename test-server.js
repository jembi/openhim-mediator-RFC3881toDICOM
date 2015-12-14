const net = require('net');

// start test upstream server
net.createServer((socket) => {
  console.log('connected to test upstream');
  socket.on('data', (buffer) => {
    console.log(buffer.toString());
  });
}).listen(6262, () => {
  console.log('Test upstream server listening...');
});

const dgram = require('dgram');

// test UDP server
var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
  console.log('server got: ' + msg + ' from ' +
    rinfo.address + ':' + rinfo.port);
});

server.on('listening', function () {
  var address = server.address();
  console.log('server listening ' +
      address.address + ':' + address.port);
});

server.bind(6464);
