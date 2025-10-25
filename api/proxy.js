// api/proxy.js
import fetch from "node-fetch";
export default async function handler(req,res){
  try{
    const url = req.query.url;
    if(!url) return res.status(400).json({ ok:false, error:"Falta ?url="});
    const r = await fetch(url, { headers:{ "User-Agent":"Mozilla/5.0 (FUEGO Proxy)" }});
    const text = await r.text();
    res.setHeader("Content-Type","text/plain; charset=utf-8");
    return res.status(200).send(text);
  }catch(e){
    return res.status(500).json({ ok:false, error:"proxy error", detalle:e.message});
  }
}
