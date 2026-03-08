const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const sharp = require("sharp")

async function start(){

const { state, saveCreds } = await useMultiFileAuthState("session")
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection } = update

if(connection === "open"){
console.log("BOT ONLINE")
}

})

if(!sock.authState.creds.registered){

const numero = "55SEUNUMERO"

const code = await sock.requestPairingCode(numero)

console.log("CODIGO:", code)

}

}

start()
