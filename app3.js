import { connect, StringCodec, JSONCodec } from "nats";
import express from 'express';
const app = express();
// to create a connection to a nats-server:
const nc = await connect({ servers: "nats:4222" });
const js = JSONCodec();
// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("app.*");
(async () => {
  for await (const m of sub) {
    //console.log(m)
    console.log(`App3 -> [${m.subject}] -> [${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    if(m.subject ==='app.request') {
        m.respond(js.encode({ts: new Date().toISOString()}))
    }else
    m.respond(sc.encode(new Date().toISOString()));
    // console.log(
    //     `[${subj}]${pad} #${s.getProcessed()} - ${m.subject} ${
    //       m.data ? " " + sc.decode(m.data) : ""
    //     }`,
    //   );
  }
  console.log("subscription closed");
})();
console.log("App2 listen to the message")

app.get('*', async (req, res) => {
    const msg = await nc.request("app.request", sc.encode("hello"), { timeout: 1000 })
    res.json({ "TS" : new Date().toISOString(), msg: sc.decode(msg.data) })
})

app.listen(3002, () => console.log('App3 listening on port 3002!'))
