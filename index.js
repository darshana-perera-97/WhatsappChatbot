const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;

function initializeClient() {
    client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('qr', (qr) => {
        // Display the QR code in terminal
        console.log('Scan this QR code to log in:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage === 'hello') {
            message.reply('Hi there!');
        } else if (lowerCaseMessage === 'how are you?') {
            message.reply('I am just a bot, but thanks for asking! How can I assist you today?');
        } else if (lowerCaseMessage === 'what is your name?') {
            message.reply('I am a WhatsApp bot created to help you. What would you like to know?');
        } else if (lowerCaseMessage.includes('help')) {
            message.reply('Sure! I can assist with the following:\n- Greeting you with "hello"\n- Telling you my name\n- Asking how you are\nIs there anything else?');
        } else {
            message.reply('I am not sure how to respond to that. Please type "help" to see what I can do.');
        }
    });

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
        initializeClient(); // Reinitialize the client
    });

    client.initialize();
}

initializeClient();
