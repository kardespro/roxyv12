const Discord = require('discord.js');// gerekli yerleri doldurun.
const client = new Discord.Client()
const ayarlar = require("./ayarlar.json")
const Shard = new Discord.ShardingManager('./index.js', {// main dosyanız
totalShards: 1,//shard sayısı
token: (ayarlar.token)
}); Shard.on('shardCreate', shard => { console.log(`${shard.id+1} IDli Shard Başlatıldı ve Kullanıma Hazır.`)
const webhook = new Discord.WebhookClient("886259043675549717","MA1rXQLGiI239ZsSCC9TdnGo7wyottGjcL4HbU3nwwzOIrZ2RomXMAprCv0qX2YT4YXd")
let embed = new Discord.MessageEmbed()
.setDescription(`${shard.id+1} İDli Shard Bağlanıyo`)
webhook.send(embed)
setTimeout(() => {
const webhook = new Discord.WebhookClient("886259043675549717","MA1rXQLGiI239ZsSCC9TdnGo7wyottGjcL4HbU3nwwzOIrZ2RomXMAprCv0qX2YT4YXd")
let embed = new Discord.MessageEmbed()
.setDescription(`${shard.id+1} idli shard bağlandı`)
webhook.send(embed)
}, 9000)
});

setTimeout(() => {
Shard.broadcastEval("process.exit()");
}, 860000);
Shard.spawn();
