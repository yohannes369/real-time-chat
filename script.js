const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const typingIndicator = document.getElementById('typing-indicator');

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

socket.on('typing', name => {
  showTypingIndicator();
});

socket.on('stop-typing', name => {
  hideTypingIndicator();
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  socket.emit('stop-typing');
  messageInput.value = '';
});

messageInput.addEventListener('input', () => {
  if (messageInput.value) {
    socket.emit('typing');
  } else {
    socket.emit('stop-typing');
  }
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}
