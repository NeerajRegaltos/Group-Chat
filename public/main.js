const socket = io();
var name = prompt("Enter Your Name Here: ");
while (name.length === 0 || name === "null") {
    name = prompt("Enter Your Name Here: ");
}
name = name.substr(0, 15);

//   console.log(name)
const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");



nameInput.innerText = name;
const messageTone = new Audio("/tone.mp3");

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on("clients-total", (data) => {
clientsTotal.innerText = `Online: ${data}`;
});


function sendMessage() {
    // console.log(messageInput.value);
    if (messageInput.value === "")
        return;
    const data = {
        name: name,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";
}

socket.on("chat-message", (data) => {
    // console.log(data);
    // showNotification();
    messageTone.play();
    addMessageToUI(false, data);

});


function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
        ${data.message}
        
        <span>${data.name} • ${new Date().toLocaleTimeString()}</span>
   </p>
</li>
`

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
        feedback: `✍️${name} is typing...`
    })
})

messageInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
        feedback: `✍️${name} is typing...`
    })
})

messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
        feedback: ""
    })
})

socket.on("feedback", (data) => {
    clearFeedback();
    const element = `
    <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
            `
    messageContainer.innerHTML += element;
});


function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach(element => {
        element.parentNode.removeChild(element);
    })
}

// function showNotification() {
//     const notification = new Notification("Guroop: "+name, {
//         name: name
        
//     })
// }

// // console.log(Notification.permission);

// if (Notification.permission === "granted") {
//     // showNotification();
// } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then(permission => {
//         if (permission === "granted") {
//             // showNotification();
//         }

//     });
// }