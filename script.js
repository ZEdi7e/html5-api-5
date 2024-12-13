document.querySelector('.load-users').addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            displayData('.output', data.map(user => `<p>${user.name} (${user.email})</p>`).join(''));
        })
        .catch(error => {
            console.error('Ошибка:', error);
            displayData('.output', '<p>Ошибка при загрузке данных</p>');
        });
});

document.querySelector('.load-posts').addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            displayData('.output', data.map(post => `<p><strong>${post.title}</strong>: ${post.body}</p>`).join(''));
        })
        .catch(error => {
            console.error('Ошибка:', error);
            displayData('.output', '<p>Ошибка при загрузке данных</p>');
        });
});

function displayData(selector, content){
    document.querySelector(selector).innerHTML = content;
}

const socket = io('http://localhost:3000');

document.querySelector('.send-button').addEventListener('click', () => {
    const message = document.querySelector('.message-input').value;
    if (message.trim()){
        socket.emit('message', message);
        document.querySelector('.message-input').value = '';
    }
});

socket.on('message', (msg) => {
    const chatOutput = document.querySelector('.chat-output');
    chatOutput.innerHTML += `<p>${msg}</p>`;
    chatOutput.scrollTop = chatOutput.scrollHeight;
});

const eventSource = new EventSource('http://localhost:3000/events');
eventSource.onmessage = (event) => {
    const sseOutput = document.querySelector('.sse-output');
    sseOutput.innerHTML += `<p>${event.data}</p>`;
    sseOutput.scrollTop = sseOutput.scrollHeight;
};

eventSource.onerror = (error) => {
    console.error('Ошибка SSE:', error);
    const sseOutput = document.querySelector('.sse-output');
    sseOutput.innerHTML += '<p>Ошибка при получении события</p>';
};