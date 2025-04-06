import WebSocket, { WebSocketServer }  from "ws";

let webSocketServer : WebSocketServer;

export function initializeWebSockerServer() {
    return new Promise((res , rej) => {
        try {
            webSocketServer = new WebSocket.Server({port : 8080});
            webSocketServer.on('connection', (ws) => {
                console.log('new client .');
                
                ws.on('message', (message) => {
                    console.log('new clients message');
                    console.log(message.toString());
                })

                ws.send(JSON.stringify({message : 'SERVER RESPONSE'}));
            });
            res(true);
        } catch (error) {
            rej(error);
        }
    })
}



// webSocketServer.on('error', (error) => {
//     console.log('WebSocket Server error');
//     console.log(error);
// });
