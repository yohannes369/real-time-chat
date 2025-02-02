const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

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
  showTyping(name);
});

socket.on('stop-typing', name => {
  hideTyping(name);
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

function showTyping(name) {
  let typingElement = document.getElementById('typing');
  if (!typingElement) {
    typingElement = document.createElement('div');
    typingElement.id = 'typing';
    typingElement.classList.add('typing');
    typingElement.innerText = `${name} is typing...`;
    messageContainer.append(typingElement);
  }
}

function hideTyping(name) {
  const typingElement = document.getElementById('typing');
  if (typingElement) {
    typingElement.remove();
  }
}
