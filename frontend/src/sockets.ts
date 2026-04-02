import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: {
        token: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WS connecté', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('WS déconnecté', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('WS error', err.message);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
