const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false
})

sock.ev.on("connection.update", async (update) => {
const { connection, pairingCode } = update

if (pairingCode) {
console.log("CODIGO:", pairingCode)
}

if (connection === "open") {
console.log("BOT CONECTADO")
}

if (connection === "close") {
console.log("Conexão fechada, tentando reconectar...")
startBot()
}
})

sock.ev.on("creds.update", saveCreds)
}

startBot()

// mantém o render vivo
setInterval(() => {}, 1000)
