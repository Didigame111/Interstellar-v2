import net from "net";

const PORT = 1080;

net.createServer(socket => {
  socket.once("data", data => {
    // SOCKS5 handshake
    socket.write(Buffer.from([0x05, 0x00]));
    socket.once("data", req => {
      const host = req[3] === 0x03
        ? req.slice(5, 5 + req[4]).toString()
        : [...req.slice(4, 8)].join(".");
      const port = req.slice(-2).readUInt16BE(0);

      const dest = net.connect(port, host, () => {
        socket.write(Buffer.from([0x05,0x00,0x00,0x01,0,0,0,0,0,0]));
        dest.pipe(socket);
        socket.pipe(dest);
      });
      dest.on("error", () => socket.destroy());
    });
  });
  socket.on("error", () => {});
}).listen(PORT, () => console.log(`SOCKS5 proxy on :${PORT}`));
