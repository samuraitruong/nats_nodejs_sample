import { connect, StringCodec, JSONCodec } from "nats";
import express from 'express';
// to create a connection to a nats-server:
const nc = await connect({ servers: "nats:4222" });

// create a codec
const sc = StringCodec();
const js = JSONCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
// const sub = nc.subscribe("hello");
// (async () => {
//   for await (const m of sub) {
//     console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
//   }
//   console.log("subscription closed");
// })();

nc.publish("app.publish", sc.encode("hello world"));

setInterval(() => nc.publish("app.inteval", sc.encode("publish message every 15 seconds")), 15000);

const app = express();
app.get('/publish', async (req, res) => {
    const msg = await nc.publish("app.publish", sc.encode("manual message publish"), { timeout: 10000 })
    
    res.json({ "TS" : new Date().toISOString(), msg: sc.decode(msg.data) })
})

app.get('*', async (req, res) => {
    const msg = await nc.request("app.request", js.encode(req.headers), { timeout: 10000 })
    
    res.json({ "TS" : new Date().toISOString(), msg: js.decode(msg.data) })
})

app.listen(3000, () => console.log('App1 listening on port 3000!'))