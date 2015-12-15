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
