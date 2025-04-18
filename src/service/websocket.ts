import WebSocket, { WebSocketServer }  from "ws";
import { Notification } from "../entities/notification";

export const webSocketServer = new WebSocket.Server({port : 8080});

let webSocketClients : Map<string, WebSocket> = new Map();

webSocketServer.on('connection', (ws, req) => {
    const userEmail = req.url?.toString().slice(1, req.url.length);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

    if(userEmail && emailRegex.test(userEmail)){
        webSocketClients.set(userEmail, ws);
    }    
    // webSocketClients.get(userEmail!)?.send(JSON.stringify({message : 'Connection successfull'}))
});

webSocketServer.on('close', () => {
    console.log('connection closed');
    webSocketClients.clear();
})

export const sendNotificationToActiveClient = (email : string, savedNotification : Notification) => {      
    webSocketClients.get(email)?.send(JSON.stringify(savedNotification));
}