// Here initialize IO
let group = '';
let user = '';
let id = '';

let server;
const hideAuth = () => {
    document.getElementById('auth').style.display = 'none';
};

const sendUser = () => {
    server = io('http://localhost:8000');
    server.on('connect', () => {
        user = document.getElementById('username').value;
        group = document.getElementById('usergroup').value;
        server.emit('setUserAndGroup', { user, group });

        server.on('confirmAuth', data => {
            for (user of data.users) {
                if (user.id !== id) {
                    user.connectedUser = user.name;
                    insertUser(user);
                }
            }
            if (data && data.status && data.status === 'ok') {
                id = data.id;
                hideAuth();
            }
            fetch(`http://localhost:8000/messages/${group}`)
                .then(r => r.json())
                .then(messages => {
                    console.log(messages);
                    for (message of messages) {
                        if (message.user == user.name) {
                            insertMessage(message.message);
                        } else {
                            insertMessage(message.message, message);
                        }
                    }
                });
        });

        server.on('userConnected', data => {
            insertUser(data);
            // console.log(data);
        });

        server.on('receiveMessage', data => {
            if (data.id !== id) {
                insertMessage(data.message, data);
            }
        });

        server.on('userDisconnected', data => {
            console.log(data, 'user disconected');
            removeUser(data.id);
        });

        server.on('disconnect', () => {
            document.getElementById('auth').style.display = 'flex';
            alert('SERVER WENT DOWN');
        });
    });
};

// Functions for send/receive message

const HAPPY = 'fa fa-smile-o';
const SAD = 'fa fa-frown-o';

let users = [];
let selectedUser = null;

const getUsers = () => {
    return (users = [{ id: 1, name: 'George' }]);
};

const insertMessage = (message, friend = null) => {
    message = message.trim();
    const messages = document.getElementById('messages');

    if (message !== '') {
        if (!friend) {
            server.emit('sendMessage', { user, group, text: message });
        }

        const div = document.createElement('div');
        friend ? div.classList.add('friend') : div.classList.add('me');
        div.classList.add('message');
        if (friend) {
            // div.innerHTML = `<span class="msg"><b>${
            //     friend.user
            // }:</b> ${message}</span><i class="icon ${SAD}"></i>`;
            div.innerHTML = `<span class="msg">${message}</span><i class="icon ${SAD}"><span>${
                friend.user
            }</span></i>`;
        } else {
            div.innerHTML = `<span class="msg">${message}</span><i class="icon ${SAD}"><span></span></i>`;
        }
        messages.appendChild(div);
    }
};

const sendMessage = (e = null) => {
    const message = document.getElementById('message');
    if (message) {
        if (e instanceof KeyboardEvent) {
            if (e.keyCode === 13) {
                insertMessage(message.innerText);
            } else {
                return;
            }
        } else if (e instanceof MouseEvent) {
            insertMessage(message.innerText);
        }
        message.innerText = '';
    }
};

const insertUser = user => {
    if (user.id !== id) {
        const Htmlusers = document.getElementById('users');
        Htmlusers.innerHTML += `<div class="user" id="${user.id}">
        <p class="user-name">${user.connectedUser}</p></div>`;
        users.push(user);
    }
};

const removeUser = userId => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            users.splice(i, 1);
            document.getElementById(userId).remove();
            return;
        }
    }
};

const insertUsers = () => {};

document.addEventListener('DOMContentLoaded', insertUsers, false);
