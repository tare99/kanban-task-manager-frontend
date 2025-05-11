import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws/tasks';

const client = new Client({
  brokerURL: SOCKET_URL,
  connectHeaders: {},
  debug: (str) => console.log(str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  webSocketFactory: () => new SockJS(SOCKET_URL),
});

export const connectWebSocket = (onMessage: (message: any) => void) => {
  client.onConnect = () => {
    console.log('Connected to WebSocket');
    client.subscribe('/topic/task-updates', (message) => {
      if (message.body) {
        const parsedMessage = JSON.parse(message.body);
        onMessage(parsedMessage);
      }
    });
  };

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client.connected) {
    client.deactivate();
  }
};