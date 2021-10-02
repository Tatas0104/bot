const wa = require('@open-wa/wa-automate');
const KBBI = require('kbbi.js')
const axios = require('axios');
const fetch = require('node-fetch');


// axios.<method> will now provide autocomplete and parameter typings

wa.create().then((Client) => start(Client));

function start(client) {
  client.onMessage(async (message) => {
    const args = message.body.trim().split(" ");
    const prefix="";
    const reply = async (txt, qId = message.id) => {
      return client.reply(message.from, txt, qId)
      .catch(e => {
        console.log(e)
      })
    }
    if (message.body === "#") {
      const groupMem = await client.getGroupMembers(message.from)
      let res = `✪〘 Mention All 〙✪\n------------------\n`
      for (let m of groupMem) {
       res += `@${m.id.replace(/@c\.us/g, '')} `
     }
     await client.sendText(message.from, res);

   } else if (message.body === "tuhu") {
    await client.sendText(message.from, "Muhammad tuhu fajriyan?");
  }else if(args[0].toLowerCase() === "kbbi"){
    if(args.length ==2){
      KBBI.cari(args[1]).then(res=>{
        let result="";
        for (let i=0; i < res['arti'].length; i++) {
          result+=`${i+1}.${res['arti'][i]}\n`
        }
        reply(result)
      }).catch(e=>{reply(`---error---\n${e}`)})
    }else{
      reply("harus berformat kbbi *(kata)* \n*contoh:kbbi apel*")
    }}else if(args[0].toLowerCase() === "covid"){
      let result ="*Data covid provinsi di indonesia*\n"
      fetch("https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json")
      .then((res) => res.json())
      .then((data) =>{
        for (let i = 0; i < 34; i++) {
          let index=data.features[i].attributes;
          result+=`*${i+1}.${index.Provinsi}*\n`;
          result+=`   kasus positive=${index.Kasus_Posi} orang\n`;
          result+=`   kasus sembuh=${index.Kasus_Semb} orang\n`;
          result+=`   kasus meninggal=${index.Kasus_Meni} orang\n`;
        }
          reply(result)
      });
    }
  });

}
