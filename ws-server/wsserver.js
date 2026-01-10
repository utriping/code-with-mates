import WebSocket, { WebSocketServer } from "ws";
const server = new WebSocket.Server({ port: 8000 });
console.log("websocket server running on port 8000");
server.on('connection',(ws)=>{
    console.log('Client Connected');
    ws.send('Hello from the webSocket server');
    server.on('message',())
},)