let socket = null;

export function connectSocket(onMessage) {
  socket = new WebSocket("ws://127.0.0.1:8000/ws/agents");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
}

export function disconnectSocket() {
  if (socket) {
    socket.close();
  }
}