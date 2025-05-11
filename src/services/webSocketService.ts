import {Client, IMessage} from '@stomp/stompjs';

const SOCKET_URL = 'ws://localhost:8080/ws/tasks'; // native ws endpoint (Spring WSConfig: reg.addEndpoint(...))

const client = new Client({
  brokerURL: SOCKET_URL,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (msg) => console.log('[WS]', msg),
});

let isConnected = false;

export const connectWebSocket = (onMessage: (event: { type: string; data: any }) => void) => {
  if (isConnected) return;

  client.onConnect = () => {
    console.log('[WS] Connected');
    isConnected = true;

    client.subscribe('/topic/tasks', (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body);
        console.log('[WS] Event:', parsed);
        onMessage(parsed);
      } catch (err) {
        console.error('[WS] Failed to parse message', err);
      }
    });
  };

  client.onDisconnect = () => {
    isConnected = false;
    console.log('[WS] Disconnected');
  };

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client && client.active) {
    client.deactivate();
    isConnected = false;
  }
};
