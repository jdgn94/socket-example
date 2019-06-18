const socket = io();

// DOM element
let message = document.getElementById('text-message');
let send = document.getElementById('submit-btn');
let chat = document.getElementById('messages');
let userLocation = document.getElementById('send-location');

function scrollToBottom() {
  let lastMessage = chat.lastElementChild;
  lastMessage.scrollIntoView();
}

socket.on('connect', function () {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log('Sin errores');
    }
  });
});

socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ol');

  users.forEach( function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  })

  let usersList = document.getElementById('users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
});

send.addEventListener('click', function (e) {
  e.preventDefault();
  socket.emit('createMessage', message.value, function () {
    message.value = '';
  });
});

// message.addEventListener('keypress', function () {
//   socket.emit('chat:typing', userName.value);
// });

userLocation.addEventListener('click', function (e) {
  if (!navigator.geolocation) return alert('La geolocalización no es compatible con este navegador');

  navigator.geolocation.getCurrentPosition(function (position) {
    var obj = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    socket.emit('createLocationMessage', obj);
  }, function () {
    alert('No se puede enviar la localización');
  })
});

socket.on('newMessage', function (data) {
  const formattedTime = moment(data.createdAt).format('LT');
  const template = document.getElementById('message-templet').innerHTML;
  const html = Mustache.render(template, {
    from: data.from,
    text: data.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  chat.appendChild(div);
  scrollToBottom();
});

socket.on('newLocationMessage', function (data) {
  const formattedTime = moment(data.createdAt).format('LT');
  const template = document.getElementById('location-message-templet').innerHTML;
  const html = Mustache.render(template, {
    from: data.from,
    url: data.url,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  chat.appendChild(div);
  scrollToBottom();
});

socket.on('chat:typing', function (data) {
  actions.innerHTML = `
    <p>
      <em>${data} is typing a message.</em>
    </p>
  `;
});