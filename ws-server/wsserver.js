import { Server } from "socket.io";
import http from "http";
import app from 'app.js'
// hum log ek websocket server create karenge jo ki alag se chalega
// client room Id creation ke route ko hit karega and room Id create hoga and then uske baad server check karga ki valid room id hai kya and then websocket server create hoga and then voh wale client component ke paas bhi wss ka code hoga ek user code publish karega and jo bhi client voh room me connected hoga unko sabko voh code dikhega
// ye websocket server hume alag se create karna padega kyuki next js me abhi tak websocket ka support nahi hai isliye hume alag se ek server create karna padega jo ki websocket ko handle karega
// aur fir hum log us websocket server ko apne next js app ke sath connect karenge
// aur fir hum log apne client component me websocket client ka code likhenge jo ki websocket server se connect hoga
// aur fir hum log messages ko send aur receive karenge
//iske request pe hi websocket server create hoga
//wss server ko req aayega ki isGroup, sender, if(isGroup) hoga tohh groupid milega or else
const server = http.createServer();
let io;
io = new Server(server);
