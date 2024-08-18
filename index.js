const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),  // This will save session data to avoid scanning the QR code every time
});

// Generate and display the QR code in the terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above to log in to WhatsApp.');
});

// Log a message when successfully authenticated
client.on('ready', () => {
    console.log('Client is ready!');
});

// Listen for incoming messages
client.on('message', (message) => {
    console.log(`Message received: ${message.body}`);

    // Check if the message contains a specific keyword
    if (message.body.toLowerCase() === 'hello') {
        // Send a reply to the same chat
        message.reply('Hi there! How can I help you today?');
    }
});

// Start the client
client.initialize();
