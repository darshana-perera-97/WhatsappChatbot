const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const OpenAI = require("openai");
require("dotenv").config();

// Create a new OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new WhatsApp client instance with increased timeout and error handling
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // Run in headless mode
    args: ["--no-sandbox"], // Required for some environments
    timeout: 60000, // Increase the timeout to 60 seconds
  },
});

// Generate and display the QR code in the terminal
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan the QR code above to log in to WhatsApp.");
});

// Log a message when successfully authenticated
client.on("ready", () => {
  console.log("Client is ready!");
});

// Error handling
client.on("error", (error) => {
  console.error("An error occurred:", error);
  // Optional: add logic to retry initialization or alert on persistent issues
});

// Listen for incoming messages
client.on("message", async (message) => {
  console.log(`Message received: ${message.body}`);

  // Forward the message to OpenAI and get a response
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Darshana Perera is the Marketing Manager at ABC Company, a Colombo 20-based leader in chatbot solutions for WhatsApp and web platforms. Under the guidance of CEO is Dulangi, the company specializes in AI-driven customer engagement tools. In addition to chatbots, ABC Company offers advanced analytics and CRM integration. Darshana drives marketing strategies to enhance brand visibility and customer growth.",
        },
        { role: "user", content: message.body },
      ],
    });

    // Send the OpenAI response back to the user on WhatsApp
    const aiResponse = completion.choices[0].message.content;
    message.reply(aiResponse);
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
    message.reply("Sorry, there was an error processing your request.");
  }
});

// Handle disconnection events
client.on("disconnected", (reason) => {
  console.log("Client was logged out:", reason);
  // Optional: Add reconnection logic here if necessary
});

// Start the client
client.initialize().catch((error) => {
  console.error("Failed to initialize client:", error);
  // Optional: retry logic or other error handling
});
