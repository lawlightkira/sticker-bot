import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import P from "pino"
import http from "http"

const PORT = process.env.PORT || 3000

http.createServer((req,res)=>{
  res.end("Bot rodando")
}).listen(PORT)

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
logger: P({ level: "silent" }),
auth: state,
printQRInTerminal: false
})

if (!sock.authState.creds.registered) {

const phoneNumber = "5511962597172"

const code = await sock.requestPairingCode(phoneNumber)
console.log("CODIGO DE PAREAMENTO:", code)

}

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection } = update

if(connection === "open"){
console.log("BOT CONECTADO AO WHATSAPP")
}

})

}

startBot()
