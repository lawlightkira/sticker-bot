const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } = require("@whiskeysockets/baileys")
const pino = require("pino")
const sharp = require("sharp")

async function startBot(){

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

if(connection === "connecting"){
console.log("Conectando ao WhatsApp...")
}

if(connection === "open"){
console.log("BOT CONECTADO")
}

if(connection === "close"){
console.log("Reconectando em 5s...")
setTimeout(startBot,5000)
}

})

if(!sock.authState.creds.registered){

setTimeout(async ()=>{

const numero = "5511962579172"

const code = await sock.requestPairingCode(numero)

console.log("CODIGO DE PAREAMENTO:",code)

},15000)

}

sock.ev.on("messages.upsert", async ({messages}) => {

const m = messages[0]
if(!m.message) return

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text ||
""

const from = m.key.remoteJid

if(text === ".s"){

const quoted =
m.message.extendedTextMessage?.contextInfo?.quotedMessage

const image =
quoted?.imageMessage || m.message.imageMessage

if(!image){
await sock.sendMessage(from,{text:"Responda uma imagem com .s"})
return
}

const msg = quoted ? { message: quoted } : m

const buffer = await downloadMediaMessage(msg,"buffer",{},{})

const sticker = await sharp(buffer)
.resize(512,512,{
fit:"contain",
background:{ r:0,g:0,b:0,alpha:0 }
})
.webp()
.toBuffer()

await sock.sendMessage(from,{sticker})

}

})

}

startBot()

setInterval(()=>{},1000)
