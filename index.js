const Discord = require("discord.js");
const fs = require("fs");
const captcha = require("captcha-plus");
const client = new Discord.Client();
const ms = require("ms");
const parse = require("parse-ms");
const http = require("http");
const qdb = require("quick.db");
const moment = require("moment");
const express = require("express");
const ayarlar = require("./ayarlar.json");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
const log = message => {
  console.log(` ${message}`);
};
require("./util/eventLoader.js")(client);
 //-------------Bot Eklenince Bir Kanala Mesaj G枚nderme Komutu ---------------\\

const emmmmbed = new Discord.MessageEmbed()
  .setThumbnail()
  .setImage(
    ""
  )
  .addField(
    `Roxy | Te艧ekk眉rler`,
    `**Selamlar, Ben Roxy (Roxy Bot'un Geli艧tiricisi) 脰ncelikle Botumuzu Ekledi臒iniz ve Bize Destek Oldu臒unuz 陌莽in Sizlere Te艧ekk眉rlerimi Sunar谋m**`
  )
  .addField(
    `Roxy | 陌statistik`,
    `**Roxy Botun 陌statisklerini G枚sterir Bakmak i莽in \`r.i\` Yazabilirsiniz.**`
  )
  .addField(
    `Roxy | Nas谋l Kullan谋l谋r?`,
    `**Roxy botun t眉m 枚zelliklerinden yararlanabilmek i莽in sadece \`r.yard谋m\` yazman谋z yeterlidir.**`
  )
  .addField(
    `Roxy | Linkler`,
    `**Komut Kanal谋na r.davet Yazman谋z Yeterlidir**`
  )
  .setFooter(`Roxy | Geli艧mi艧 T眉rk莽e Bot | 2021`)
  .setTimestamp();

client.on("guildCreate", guild => {
  let defaultChannel = "";
  guild.channels.cache.forEach(channel => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });

  defaultChannel.send(emmmmbed);
});

//----------------------------------------------------------------\\

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut y眉klenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Y眉klenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.on("guildMemberRemove", async member => {
  const channel = qdb.fetch(`saya莽Kanal_${member.guild.id}`);
  if (qdb.has(`sayacsay谋_${member.guild.id}`) == false) return;
  if (qdb.has(`saya莽Kanal_${member.guild.id}`) == false) return;

  member.guild.channels.cache
    .get(channel)
    .send(
      `馃摛 **${member.user.tag}** Sunucudan ayr谋ld谋! \`${qdb.fetch(
        `sayacsay谋_${member.guild.id}`
      )}\` 眉ye olmam谋za son \`${qdb.fetch(`sayacsay谋_${member.guild.id}`) -
        member.guild.memberCount}\` 眉ye kald谋!`
    );
});
client.on("guildMemberAdd", async member => {
  const channel = qdb.fetch(`saya莽Kanal_${member.guild.id}`);
  if (qdb.has(`sayacsay谋_${member.guild.id}`) == false) return;
  if (qdb.has(`saya莽Kanal_${member.guild.id}`) == false) return;

  member.guild.channels.cache
    .get(channel)
    .send(
      `馃摜 **${member.user.tag}** Sunucuya Kat谋ld谋! \`${qdb.fetch(
        `sayacsay谋_${member.guild.id}`
      )}\` 眉ye olmam谋za son \`${qdb.fetch(`sayacsay谋_${member.guild.id}`) -
        member.guild.memberCount}\` 眉ye kald谋!`
    );
});

///////////////////////////////////SA-AS

client.on("message", async msg => {
  const i = await qdb.fetch(`ssaass_${msg.guild.id}`);
  if (i == "acik") {
    if (
      msg.content.toLowerCase() == "sa" ||
      msg.content.toLowerCase() == "s.a" ||
      msg.content.toLowerCase() == "selamun aleyk眉m" ||
      msg.content.toLowerCase() == "sea" ||
      msg.content.toLowerCase() == "selam" 
  ) {
      try {
        return msg.reply(
          "**Aleyk眉m Selam Ho艧geldin** <:yialo:835891324908601357> "
        );
      } catch (err) {
        console.log(err);
      }
    }
  } else if (i == "kapali") {
  }
  if (!i) return;
});

//////////////afk

client.on('message', async message => {
 
  let prefix = await qdb.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
 
  let kullan谋c谋 = message.mentions.users.first() || message.author
  let afkdkullan谋c谋 = await qdb.fetch(`afk_${message.author.id}`)
  let afkkullan谋c谋 = await qdb.fetch(`afk_${kullan谋c谋.id}`)
  let afkkullan谋c谋谋 = await qdb.fetch(`afk_${kullan谋c谋}`)
  let sebep = afkkullan谋c谋
 
  if (message.author.bot) return;
  if (message.content.includes(`${prefix}afk`)) return;

  if (!message.content.includes(`<@${kullan谋c谋.id}>`)) {
    if (afkdkullan谋c谋) {
      message.member.setNickname(`${message.author.username}`);
      
      message.channel.send(`鈽�锔� **<@${message.author.id}>** adl谋 kullan谋c谋 art谋k **AFK** de臒il.  : \`${sebep}\` sebebi iptal edildi`)
      qdb.delete(`afk_${message.author.id}`)
    }
  
  }
});
///////////////////////////////////REKLAMENLGEL
client.on("message", message => {
if(message.author.bot) return;
if(qdb.has(`reklamengel_${message.guild.id}`)){  
const kelime = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".gg", ".me", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
if (kelime.some(word => message.content.includes(word))) {
try {
if (!message.member.hasPermission("BAN_MEMBERS")) {
message.delete();
const uyar谋 = new Discord.MessageEmbed()
.setColor('BLACK')
.setTitle("Reklam Engel Filtresi")
.setDescription(`${message.author} Bu sunucuda reklam engel a莽谋k karde艧im reklam yapt谋rmam! :hawli:`)
return message.channel.send(uyar谋).then(arezcik => arezcik.delete({timeout: 5000}))
}              
} catch(err) {
console.log(err);
}
}}
else return;
})
////////////////////K脺F脺R

const k眉f眉r = ["abaza", "abazan", "ag", "a\u011fz\u0131na s\u0131\u00e7ay\u0131m", "ahmak", "allah", "allahs\u0131z", "am", "amar\u0131m", "ambiti", "am biti", "amc\u0131\u011f\u0131", "amc\u0131\u011f\u0131n", "amc\u0131\u011f\u0131n\u0131", "amc\u0131\u011f\u0131n\u0131z\u0131", "amc\u0131k", "amc\u0131k ho\u015faf\u0131", "amc\u0131klama", "amc\u0131kland\u0131", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "am\u0131k", "am\u0131na", "am\u0131nako", "am\u0131na koy", "am\u0131na koyar\u0131m", "am\u0131na koyay\u0131m", "am\u0131nakoyim", "am\u0131na koyyim", "am\u0131na s", "am\u0131na sikem", "am\u0131na sokam", "am\u0131n feryad\u0131", "am\u0131n\u0131", "am\u0131n\u0131 s", "am\u0131n oglu", "am\u0131no\u011flu", "am\u0131n o\u011flu", "am\u0131s\u0131na", "am\u0131s\u0131n\u0131", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyay\u0131m", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amk", "amkafa", "amk \u00e7ocu\u011fu", "amlarnzn", "aml\u0131", "amm", "ammak", "ammna", "amn", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amq", "ams\u0131z", "amsiz", "amsz", "amteri", "amugaa", "amu\u011fa", "amuna", "ana", "anaaann", "anal", "analarn", "anam", "anamla", "anan", "anana", "anandan", "anan\u0131", "anan\u0131", "anan\u0131n", "anan\u0131n am", "anan\u0131n am\u0131", "anan\u0131n d\u00f6l\u00fc", "anan\u0131nki", "anan\u0131sikerim", "anan\u0131 sikerim", "anan\u0131sikeyim", "anan\u0131 sikeyim", "anan\u0131z\u0131n", "anan\u0131z\u0131n am", "anani", "ananin", "ananisikerim", "anani sikerim", "ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anas\u0131n\u0131", "anas\u0131n\u0131n am", "anas\u0131 orospu", "anasi", "anasinin", "anay", "anayin", "angut", "anneni", "annenin", "annesiz", "anuna", "aptal", "aq", "a.q", "a.q.", "aq.", "ass", "atkafas\u0131", "atm\u0131k", "att\u0131rd\u0131\u011f\u0131m", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azd\u0131m", "azd\u0131r", "azd\u0131r\u0131c\u0131", "babaannesi ka\u015far", "baban\u0131", "baban\u0131n", "babani", "babas\u0131 pezevenk", "baca\u011f\u0131na s\u0131\u00e7ay\u0131m", "bac\u0131na", "bac\u0131n\u0131", "bac\u0131n\u0131n", "bacini", "bacn", "bacndan", "bacy", "bastard", "basur", "beyinsiz", "b\u0131z\u0131r", "bitch", "biting", "bok", "boka", "bokbok", "bok\u00e7a", "bokhu", "bokkkumu", "boklar", "boktan", "boku", "bokubokuna", "bokum", "bombok", "boner", "bosalmak", "bo\u015falmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cif", "cikar", "cim", "\u00e7\u00fck", "dalaks\u0131z", "dallama", "daltassak", "dalyarak", "dalyarrak", "dangalak", "dassagi", "diktim", "dildo", "dingil", "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domald\u0131", "domald\u0131n", "domal\u0131k", "domal\u0131yor", "domalmak", "domalm\u0131\u015f", "domals\u0131n", "domalt", "domaltarak", "domalt\u0131p", "domalt\u0131r", "domalt\u0131r\u0131m", "domaltip", "domaltmak", "d\u00f6l\u00fc", "d\u00f6nek", "d\u00fcd\u00fck", "eben", "ebeni", "ebenin", "ebeninki", "ebleh", "ecdad\u0131n\u0131", "ecdadini", "embesil", "emi", "fahise", "fahi\u015fe", "feri\u015ftah", "ferre", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "geber", "geberik", "gebermek", "gebermi\u015f", "gebertir", "ger\u0131zekal\u0131", "gerizekal\u0131", "gerizekali", "gerzek", "giberim", "giberler", "gibis", "gibi\u015f", "gibmek", "gibtiler", "goddamn", "godo\u015f", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "g\u00f6t", "g\u00f6t deli\u011fi", "g\u00f6telek", "g\u00f6t herif", "g\u00f6tlalesi", "g\u00f6tlek", "g\u00f6to\u011flan\u0131", "g\u00f6t o\u011flan\u0131", "g\u00f6to\u015f", "g\u00f6tten", "g\u00f6t\u00fc", "g\u00f6t\u00fcn", "g\u00f6t\u00fcne", "g\u00f6t\u00fcnekoyim", "g\u00f6t\u00fcne koyim", "g\u00f6t\u00fcn\u00fc", "g\u00f6tveren", "g\u00f6t veren", "g\u00f6t verir", "gtelek", "gtn", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz", "hayvan herif", "ho\u015faf\u0131", "h\u00f6d\u00fck", "hsktr", "huur", "\u0131bnel\u0131k", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot", "idiyot", "imansz", "ipne", "iserim", "i\u015ferim", "ito\u011flu it", "kafam girsin", "kafas\u0131z", "kafasiz", "kahpe", "kahpenin", "kahpenin feryad\u0131", "kaka", "kaltak", "kanc\u0131k", "kancik", "kappe", "karhane", "ka\u015far", "kavat", "kavatn", "kaypak", "kayyum", "kerane", "kerhane", "kerhanelerde", "kevase", "keva\u015fe", "kevvase", "koca g\u00f6t", "kodu\u011fmun", "kodu\u011fmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyay\u0131m", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym", "laciye boyad\u0131m", "lavuk", "libo\u015f", "madafaka", "mal", "malafat", "malak", "manyak", "mcik", "meme", "memelerini", "mezveleli", "minaamc\u0131k", "mincikliyim", "mna", "monakkoluyum", "motherfucker", "mudik", "oc", "ocuu", "ocuun", "O\u00c7", "o\u00e7", "o. \u00e7ocu\u011fu", "o\u011flan", "o\u011flanc\u0131", "o\u011flu it", "orosbucocuu", "orospu", "orospucocugu", "orospu cocugu", "orospu \u00e7oc", "orospu\u00e7ocu\u011fu", "orospu \u00e7ocu\u011fu", "orospu \u00e7ocu\u011fudur", "orospu \u00e7ocuklar\u0131", "orospudur", "orospular", "orospunun", "orospunun evlad\u0131", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspu\u00e7ocu\u011fu", "oruspu \u00e7ocu\u011fu", "osbir", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum", "otuzbir", "\u00f6k\u00fcz", "\u00f6\u015fex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evlad\u0131", "pezevenk", "pezo", "pic", "pici", "picler", "pi\u00e7", "pi\u00e7in o\u011flu", "pi\u00e7 kurusu", "pi\u00e7ler", "pipi", "pipi\u015f", "pisliktir", "porno", "pussy", "pu\u015ft", "pu\u015fttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "salaak", "salak", "saxo", "sekis", "serefsiz", "sevgi koyar\u0131m", "sevi\u015felim", "sexs", "s\u0131\u00e7ar\u0131m", "s\u0131\u00e7t\u0131\u011f\u0131m", "s\u0131ecem", "sicarsin", "sie", "sik", "sikdi", "sikdi\u011fim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmi\u015f", "sikilsin", "sikim", "sikimde", "sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "siki\u015f", "siki\u015fen", "siki\u015fme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "sikti\u011fim", "sikti\u011fimin", "sikti\u011fiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin", "siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm", "skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokar\u0131m", "sokarim", "sokarm", "sokarmkoduumun", "sokay\u0131m", "sokaym", "sokiim", "soktu\u011fumunun", "sokuk", "sokum", "soku\u015f", "sokuyum", "soxum", "sulaleni", "s\u00fclaleni", "s\u00fclalenizi", "s\u00fcrt\u00fck", "\u015ferefsiz", "\u015f\u0131ll\u0131k", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "ta\u015fak", "ta\u015f\u015fak", "tipini s.k", "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "toto\u015f", "vajina", "vajinan\u0131", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalar\u0131m", "yalarun", "yaraaam", "yarak", "yaraks\u0131z", "yaraktr", "yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraam\u0131", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarra\u011f", "yarra\u011f\u0131m", "yarra\u011f\u0131m\u0131", "yarraimin", "yarrak", "yarram", "yarramin", "yarraminba\u015f\u0131", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yav\u015f", "yav\u015fak", "yav\u015fakt\u0131r", "yavu\u015fak", "y\u0131l\u0131\u015f\u0131k", "yilisik", "yogurtlayam", "yo\u011furtlayam", "yrrak", "z\u0131kk\u0131m\u0131m", "zibidi", "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini","len","lan","lna"];

client.on("messageUpdate", async (old, nev) => {

    if (old.content != nev.content) {
        let i = await qdb.fetch(`k眉f眉r.${nev.member.guild.id}.durum`);
        let y = await qdb.fetch(`k眉f眉r.${nev.member.guild.id}.kanal`);
        if (i) {

            if (k眉f眉r.some(word => nev.content.includes(word))) {
                if (nev.member.hasPermission("BAN_MEMBERS")) return;
                //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
                const embed = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${nev.author} , **Ben varken k眉f眉rm眉 emteye 莽al谋艧t谋n?**`)
                    .addField("K眉f眉r:", nev)

                nev.delete();
                const embeds = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${nev.author} , **Mesaj谋 editle k眉f眉r etmekmi?**`)
                client.channels.cache.get(y).send(embed)
                nev.channel.send(embeds).then(msg => msg.delete({
                    timeout: 5000
                }));

            }
        } else {}
        if (!i) return;
    }
});

client.on("message", async msg => {


    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;
    let y = await qdb.fetch(`k眉f眉r.${msg.member.guild.id}.kanal`);

    let i = await qdb.fetch(`k眉f眉r.${msg.member.guild.id}.durum`);
    if (i) {
        if (k眉f眉r.some(word => msg.content.toLowerCase().includes(word))) {
            try {
                if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
                    msg.delete({
                        timeout: 750
                    });
                    const embeds = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`<@${msg.author.id}> , **K眉f眉r etmeye 莽al谋艧t谋 ama ben varken asla!**`)
                    msg.channel.send(embeds).then(msg => msg.delete({
                        timeout: 5000
                    }));
                    const embed = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${msg.author} , **K眉f眉r etmeye 莽al谋艧t谋 ama ben varken asla!**`).addField("Mesaj谋:", msg)
                    client.channels.cache.get(y).send(embed)
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    if (!i) return;
})

//////////////////////////MODLOG///////////////////
client.on("messageDelete", async message => {
  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(
    await qdb.fetch(`log_${message.guild.id}`)
  );

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullan谋c谋: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "");

  log.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let modlog = await qdb.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

    .addField("**Eylem**", "Mesaj D眉zenleme")

    .addField(
      "**Mesaj谋n sahibi**",
      `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
    )

    .addField("**Eski Mesaj谋**", `${oldMessage.content}`)

    .addField("**Yeni Mesaj谋**", `${newMessage.content}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
      oldMessage.guild.iconURL()
    )

    .setThumbnail(oldMessage.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelCreate", async channel => {
  let modlog = await qdb.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

   const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `<#${channel.id}>`;

  if (channel.type === "voice") kanal = `\`${channel.name}\``;

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Olu艧turma")

    .addField("**Kanal谋 Olu艧turan Ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Olu艧turdu臒u Kanal**", `${kanal}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconUR);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelDelete", async channel => {
  let modlog = await qdb.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Silme")

    .addField("**Kanal谋 Silen Ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleCreate", async role => {
  let modlog = await qdb.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Rol Olu艧turma")

    .addField("**Rol眉 olu艧turan ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Olu艧turulan rol**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleDelete", async role => {
  let modlog = await qdb.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Rol Silme")

    .addField("**Rol眉 silen ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Silinen rol**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await qdb.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji Olu艧turma")

    .addField("**Emojiyi olu艧turan ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Olu艧turulan emoji**", `${emoji} - 陌smi: \`${emoji.name}\``)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let modlog = await qdb.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji Silme")

    .addField("**Emojiyi silen ki艧i**", `<@${entry.executor.id}>`)

    .addField("**Silinen emoji**", `${emoji}`)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let modlog = await qdb.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji G眉ncelleme")

    .addField("**Emojiyi g眉ncelleyen ki艧i**", `<@${entry.executor.id}>`)

    .addField(
      "**G眉ncellenmeden 枚nceki emoji**",
      `${oldEmoji} - 陌smi: \`${oldEmoji.name}\``
    )

    .addField(
      "**G眉ncellendikten sonraki emoji**",
      `${newEmoji} - 陌smi: \`${newEmoji.name}\``
    )

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
      oldEmoji.guild.iconURL
    )

    .setThumbnail(oldEmoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanAdd", async (guild, user) => {
  let modlog = await qdb.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Yasaklama")

    .addField("**Kullan谋c谋y谋 yasaklayan yetkili**", `<@${entry.executor.id}>`)

    .addField("**Yasaklanan kullan谋c谋**", `**${user.tag}** - ${user.id}`)

    .addField("**Yasaklanma sebebi**", `${entry.reason}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanRemove", async (guild, user) => {
  let modlog = await qdb.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Yasak kald谋rma")

    .addField("**Yasa臒谋 kald谋ran yetkili**", `<@${entry.executor.id}>`)

    .addField("**Yasa臒谋 kald谋r谋lan kullan谋c谋**", `**${user.tag}** - ${user.id}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

//////////////////////////////MODLOG///////////////////////////


//////////////////////////////OTOROL

client.on("guildMemberAdd", member => {
  let rol = qdb.fetch(`autoRole_${member.guild.id}`);
if (!rol) return;
  let kanal = qdb.fetch(`autoRoleChannel_${member.guild.id}`);
  if (!kanal) return;

  member.roles.add(member.guild.roles.cache.get(rol));
  let embed = new Discord.MessageEmbed()
    .setDescription(
      "> <:emoji_3:835160028616327169> **Sunucuya yeni kat谋lan** **" +
        member.user.username +
        "** **Kullan谋c谋s谋na** <@&" +
        rol +
"> **Rol眉 verildi** <:emoji_3:835160028616327169>"
    )
    .setColor("RANDOM"); //.setFooter(`<@member.id>`)
  member.guild.channels.cache.get(kanal).send(embed);
});
 
//////////////////////////////////////////////////

client.on("ready", async () => {
  let botVoiceChannel = client.channels.cache.get("835088850941378590");
  console.log("Bot Ses Kanal谋na ba臒land谋!");
  if (botVoiceChannel)
    botVoiceChannel
      .join()
      .catch(err => console.error("Bot ses kanal谋na ba臒lanamad谋!"));
});
///////////////////////////////
client.on('guildMemberAdd', member => {
     let kanal = qdb.fetch(`g眉venlik.${member.guild.id}`)
     if(!kanal) return;

       let aylar = {
               "01": "Ocak",
               "02": "艦ubat",
               "03": "Mart",
               "04": "Nisan",
               "05": "May谋s",
               "06": "Haziran",
               "07": "Temmuz",
               "08": "A臒ustos",
               "09": "Eyl眉l",
               "10": "Ekim",
               "11": "Kas谋m",
               "12": "Aral谋k"
    }

  let biti艧 = member.user.createdAt
      let g眉n眉 = moment(new Date(biti艧).toISOString()).format('DD')
      let ay谋 = moment(new Date(biti艧).toISOString()).format('MM').replace("01", "Ocak").replace("02","艦ubat").replace("03","Mart").replace("04", "Nisan").replace("05", "May谋s").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "A臒ustos").replace("09", "Eyl眉l").replace("10","Ekim").replace("11","Kas谋m").replace("12","Aral谋k").replace("12","Night")//codare
     let y谋l谋 =  moment(new Date(biti艧).toISOString()).format('YYYY')
     let saati = moment(new Date(biti艧).toISOString()).format('HH:mm')

let g眉nay = `${g眉n眉} ${ay谋} ${y谋l谋} ${saati}`  

      let s眉re = member.user.createdAt
      let g眉n = moment(new Date(s眉re).toISOString()).format('DD')
      let hafta = moment(new Date(s眉re).toISOString()).format('WW')
      let ay = moment(new Date(s眉re).toISOString()).format('MM')
      let ayy = moment(new Date(s眉re).toISOString()).format('MM')
      let y谋l =  moment(new Date(s眉re).toISOString()).format('YYYY')
     let y谋l2 = moment(new Date().toISOString()).format('YYYY')

     let nety谋l = y谋l2 - y谋l

     let created = ` ${nety谋l} y谋l  ${ay} ay ${hafta} hafta ${g眉n} g眉n 枚nce`

     let kontrol;
     if(s眉re < 1296000000) kontrol = 'Bu hesap 艧眉pheli!'
     if(s眉re > 1296000000) kontrol = 'Bu hesap g眉venli!'

     let codare = new Discord.MessageEmbed()
     .setColor('GREEN')
     .setTitle(`${member.user.username} Kat谋ld谋`)
     .setDescription('<@'+member.id+'> Bilgileri : \n\n  Hesap olu艧turulma tarihi **[' + created + ']** (`' + g眉nay + '`) \n\n Hesap durumu : **' + kontrol + '**')//codare
     .setTimestamp()
     client.channels.cache.get(kanal).send(codare)
})

client.on('guildMemberAdd', async (member) => {
  var teyitci = qdb.fetch(`teyitci_${member.guild.id}`)
  var rol = `<@&${teyitci}>`
  var gelen = `<@${member.id}>`
  var rolMesaj = `鈫� ${rol} Rolundekiler Senle En K谋sa Zamanda 陌lgilenicek`
  if(!teyitci) {
  var rol = ""
  var gelen = ""
  var rolMesaj = "鈫� Sunucumuza Boost basarak 枚zel avantajlar谋n sahibi olabilirsin!"
  }
  var kanal = qdb.fetch(`hgbbkanali_${member.guild.id}`)
  if(!kanal) return;
  var tag = qdb.fetch(`tag_${member.guild.id}`)
  var tagMesaj = `鈫� Ayr谋ca Tag谋m谋z谋 Alarak Bize Destek Olabilirsin "${tag}"`
  if(!tag){
    var tag = ""
    var tagMesaj = ""
  }
    let viruskanal = member.guild.channels.cache.get(kanal)
  let virususer = client.users.cache.get(member.id);
  let viruskullan谋c谋 = client.users.cache.get(member.id)
  const virushesapkurulus = new Date().getTime()- viruskullan谋c谋.createdAt.getTime();
  let viruj;
  if (virushesapkurulus < 1296000000) viruj = ' G眉venilir De臒il!'
  if (virushesapkurulus > 1296000000) viruj = ' G眉venilir!'
    const hgembed = new Discord.MessageEmbed()
    .setDescription(`
    
     鈫� Aram谋za Ho艧geldin **${virususer.username}** !
  
     鈫� Seninle Birlikte **${member.guild.memberCount}** Ki艧iyiz
  
     ${rolMesaj}
     
     鈫� 陌smini Ve Ya艧谋n谋 Yaz谋p Kay谋t Olabilirsin.

     鈫� Hesab谋n Kurulu艧 Tarihi ${moment(member.user.createdAt).format("**DD MMMM YYYY hh:mm:ss**") }
  
     鈫� Hesab谋n G眉venlik Durumu: **${viruj}**
    
     ${tagMesaj}
    
    `)
    .setColor("#2f3136")
    .setTitle("Aram谋za Yeni Birisi Kat谋ld谋 !")
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setAuthor(member.guild.name,member.guild.iconURL({dynamic:true}))
    .setFooter(`${member.guild.name} Kay谋t Sistemi`)
    viruskanal.send(`${rol} ${gelen}`, hgembed) ;
  })

client.on('guildMemberRemove', async (member) => {
  var gelen = `<@${member.id}>`
  var kanal = qdb.fetch(`hgbbkanali_${member.guild.id}`)
  if(!kanal) return;
    var viruskanal = member.guild.channels.cache.get(kanal)
  let virususer = client.users.cache.get(member.id);
  let viruskullan谋c谋 = client.users.cache.get(member.id)
  const virushesapkurulus = new Date().getTime()- viruskullan谋c谋.createdAt.getTime();
  let viruj;
  if (virushesapkurulus < 1296000000) viruj = ' G眉venilir De臒ildi...'
  if (virushesapkurulus > 1296000000) viruj = ' G眉venilirdi...'
    const hgembed = new Discord.MessageEmbed()
    .setDescription(`
    
     鈫� **${virususer.username}** Aram谋zdan Ayr谋ld谋 :(
  
     鈫� Sensiz **${member.guild.memberCount}** Ki艧iyiz

     鈫� Hesab谋n Kurulu艧 Tarihi ${moment(member.user.createdAt).format("**DD MMMM YYYY hh:mm:ss**") }
  
     鈫� Hesab谋n G眉venlik Durumu: **${viruj}**
    
    `)
    .setColor("#2f3136")
    .setTitle("Birisi aram谋zdan ayr谋ld谋 :(")
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setAuthor(member.guild.name,member.guild.iconURL({dynamic:true}))
    .setFooter(`${member.guild.name} Kay谋t Sistemi`)
    viruskanal.send(hgembed) ;
  })

client.on("channelDelete", async function(channel) {
    let exay = await qdb.fetch(`kanalk_${channel.guild.id}`);
  
  if (exay) {
const guild = channel.guild.cache;
let channelp = channel.parentID;

  channel.clone().then(z => {
    let kanal = z.guild.channels.find(c => c.name === z.name);
    kanal.setParent(
      kanal.guild.channels.find(channel => channel.id === channelp)
      
    );
  });
  }
})
///////rolkoruma
client.on("roleDelete", async role => {
  let rol = await qdb.fetch(`rolk_${role.guild.id}`);
  if (rol) { 
         const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
  role.guild.roles.create({ data: {
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: role.permissions,
          mentionable: role.mentionable,
          position: role.position
}, reason: 'Rol koruma a莽谋k oldu臒undan yetkili taraf谋ndan silinen rol tekrar a莽谋ld谋.'})
  }
})
client.on("emojiDelete", async (emoji, message) => {
  
  let kanal = await qdb.fetch(`emotek_${emoji.guild.id}`);
  if (!kanal) return;
  
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
    
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
    
   let embbed = new Discord.MessageEmbed()
   .setColor('RANDOM')
   .setTitle(`Bir Emoji Silindi`)
   .setDescription(`Silinen Emoji: ${emoji.name}, Emoji Koruma Sistemi A莽谋k Oldu臒undan Tekrar Eklendi!`)
   message.client.channels.cache.get(kanal).send(embbed)
  
  }

})
client.on('message', async message => {
  const ms = require('ms');
  const args = message.content.slice(ayarlar.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "R!normal2") {
  if (message.guild.channels.find(channel => channel.name === "Bot Kullan谋m谋")) return message.channel.send(" Bot Paneli Zaten Ayarlanm谋艧.")
  if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Bu Kodu `Y枚netici` Yetkisi Olan Ki艧i Kullanabilir.");
    message.channel.send(`Bot Bilgi Kanallar谋n谋n kurulumu ba艧lat谋ls谋n m谋? ba艧lat谋lacak ise **evet** yaz谋n谋z.`)
      message.channel.awaitMessages(response => response.content === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
    .then((collected) => {
   message.guild.createChannel('|鈻柆|脰NEML陌 KANALLAR|鈻柆|', 'category', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])



        
 message.guild.createChannel('銆岎煋冦�峩urallar', 'text', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|脰NEML陌 KANALLAR|鈻柆|")));
 message.guild.createChannel('銆岎煔�峠elen-giden', 'text', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])
.then(channel =>
       channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|脰NEML陌 KANALLAR|鈻柆|")));
       message.guild.createChannel('銆屸渽銆峴aya莽', 'text', [{
        id: message.guild.id,
        deny: ['SEND_MESSAGES']
      }])
.then(channel =>
             channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|脰NEML陌 KANALLAR|鈻柆|")));
             message.guild.createChannel('銆岎煉俱�峫og-kanal谋', 'text', [{
              id: message.guild.id,
              deny: ['SEND_MESSAGES']
            }])
            .then(channel => channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|脰NEML陌 KANALLAR|鈻柆|")));
            message.guild.createChannel('銆岎煋€�峝uyuru-odas谋', 'text', [{
              id: message.guild.id,
              deny: ['SEND_MESSAGES']
            }])
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|脰NEML陌 KANALLAR|鈻柆|")));

       }) 
       .then((collected) => {
        message.guild.createChannel('|鈻柆|GENEL KANALLAR|鈻柆|', 'category', [{
       id: message.guild.id,
     }]);
             
      message.guild.createChannel(`銆岎煉°�嵟焛kayet-ve-枚neri`, 'text')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|GENEL KANALLAR|鈻柆|")));
     message.guild.createChannel(`銆岎煈ャ�峱re-arama-odas谋`, 'text')
     .then(channel =>
            channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|GENEL KANALLAR|鈻柆|")));
     message.guild.createChannel(`銆岎煋枫�峠枚rsel-i莽erik`, 'text')
     .then(channel =>
                  channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|GENEL KANALLAR|鈻柆|")));
     message.guild.createChannel(`銆岎煠栥�峛ot-komutlar谋`, 'text')
     .then(channel =>
                  channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|GENEL KANALLAR|鈻柆|")));
     message.guild.createChannel(`銆岎煉�峴ohbet`, 'text')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|GENEL KANALLAR|鈻柆|")));

      message.guild.createChannel(`馃弳銆婯urucu Odas谋`, "voice")
      .then(channel =>
        channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|SES KANALLARI|鈻柆|")))
      .then(c => {
        let role = message.guild.roles.find("name", "@everyone");
        let role2 = message.guild.roles.find("name", "Kurucu");
        
        c.overwritePermissions(role, {
            CONNECT: false,
        });
        c.overwritePermissions(role2, {
            CONNECT: true,
            
        });
    })

    message.guild.createChannel('|鈻柆|SES KANALLARI|鈻柆|', 'category', [{
      id: message.guild.id,
    }]);

    message.guild.createChannel(`馃弳銆媃枚netici Odas谋`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|SES KANALLARI|鈻柆|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "Kurucu");
      let role3 = message.guild.roles.find("name", "Y枚netici");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
      });
  })

  message.guild.createChannel(`馃挰銆婼ohbet Odas谋`, "voice")
  .then(channel =>
    channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|SES KANALLARI|鈻柆|")))
  .then(c => {
    let role = message.guild.roles.find("name", "@everyone");
    c.overwritePermissions(role, {
        CONNECT: true,
    });
})

message.guild.createChannel('|鈻柆|OYUN ODALARI|鈻柆|', 'category', [{
  id: message.guild.id,
}]);

message.guild.createChannel(`馃幃銆婰OL`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
 message.guild.createChannel(`馃幃銆媄ULA`, 'voice')
 .then(channel =>
  channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
 message.guild.createChannel(`馃幃銆婥OUNTER STR陌KE`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
 message.guild.createChannel(`馃幃銆婸UBG`, 'voice')
 .then(channel =>
  channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
  message.guild.createChannel(`馃幃銆婩ORTN陌TE`, 'voice')
  .then(channel =>
   channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
   message.guild.createChannel(`馃幃銆婱陌NECRAFT`, 'voice')
   .then(channel =>
    channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
    message.guild.createChannel(`馃幃銆婻OBLOX`, 'voice')
    .then(channel =>
     channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))
     message.guild.createChannel(`馃幃銆媁OLFTEAM`, 'voice')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|鈻柆|OYUN ODALARI|鈻柆|")))



      message.guild.createRole({
        name: 'Kurucu',
        color: 'RED',
        permissions: [
            "ADMINISTRATOR",
    ]
      })

      
      message.guild.createRole({
        name: 'Y枚netici',
        color: 'BLUE',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
    ]
      })

      message.guild.createRole({
        name: 'Moderat枚r',
        color: 'GREEN',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
      })

      message.guild.createRole({
        name: 'V.I.P',
        color: '00ffff',
      })

      message.guild.createRole({
        name: '脺ye',
        color: 'WHITE',
      })

      message.guild.createRole({
        name: 'Bot',
        color: 'ORANGE',
      })

       message.channel.send("Gerekli Odalar Kuruldu!")
     
            })   
    
}
});
client.on('guildMemberAdd', async member => {
const data = require('quick.db')
const asd = data.fetch(`${member.guild.id}.jail.${member.id}`)
if(asd) {
let data2 = await data.fetch(`jailrol_${member.guild.id}`)
let rol = member.guild.roles.get(data2)
if(!rol) return;
let ki艧i = member.guild.members.get(member.id)
ki艧i.addRole(rol.id);
ki艧i.roles.forEach(r => {
ki艧i.removeRole(r.id)
data.set(`${member.guild.id}.jail.${ki艧i.id}.roles.${r.id}`, r.id )})
    data.set(`${member.guild.id}.jail.${ki艧i.id}`, 'codare')
  const wasted = new Discord.RichEmbed()
  .setAuthor(member.user.tag, member.user.avatarURL)
  .setColor(`#f3c7e1`)
  .setDescription(`Aa, beni kand谋ramazs谋n!`)
  .setTimestamp()
    member.send(wasted)
} 
  
  
})
////--------------BOTA DM ATANLAR BA艦LANGI脟-------------////

client.on("message", msg => {
  var dm = client.channels.cache.get("821714802086772807");
  if (msg.channel.type === "dm") {
    if (msg.author.id === client.user.id) return;
    const botdm = new Discord.MessageEmbed()
      .setTitle(`${client.user.username} Dm`)
      .setTimestamp()
      .setColor("RANDOM")
      .setThumbnail(`${msg.author.avatarURL()}`)
      .addField("G枚nderen", msg.author.tag)
      .addField("G枚nderen ID", msg.author.id)
      .addField("G枚nderilen Mesaj", msg.content);

    dm.send(botdm);
  }
  if (msg.channel.bot) return;
});
///--------BOTA DM ATANLAR SONU-------------////
client.on("message", msg => {
const db = require("quick.db");
  let enginar= db.fetch(`onayl谋canl谋destek_${msg.author.id}`)
  if(!enginar) return;
  let engin = db.fetch(`canl谋destekkanal_${msg.author.id}`)
  var dm = client.channels.cache.get(engin)
  if(msg.channel.type === "dm") {
  if(msg.author.id === client.user.id) return;
  const botdm = new Discord.MessageEmbed()
  .setTitle(`CANLI DESTEK MESAJI`)
  .setTimestamp()
  .setColor("RED")
  .setThumbnail(`${msg.author.avatarURL()}`)
  .setDescription(`<@${msg.author.id}> adl谋 ki艧i ile ba艧latt谋臒谋n谋z destek talebinden yeni mesaj! \n \n  Mesaj: **${msg.content}** \n \n Sizde mejaj g枚ndermek istiyorsan谋z !canl谋-mesaj-yolla id mesaj \n\n Bitirmek i莽in: !canl谋-destek-bitir id`)
.setFooter('SkadeX-Night')
  
  dm.send(botdm)
  
  }
  if(msg.channel.bot) return;
  });
client.on(`ready`, async () => {

let guild = client.guilds.get(`821712297109356574`) // kanal谋n bulundu臒u sunucu id
let online = guild.members.filter(m => !m.user.bot && m.user.presence.status !== "offline").size;
let onnl = `Toplam 脺ye: ${guild.members.size}\nAktif 脺ye: ${online}`

setInterval(() => {
client.channels.get(`821714802086772807`).setTopic(`${onnl.replace(`1`, ` :one: `).replace(/2/, ` :two: `).replace(`3`, ` :three: `).replace(/4/, ` :four: `).replace(`5`, ` :five: `).replace(/6/, ` :six: `).replace(`7`, ` :seven: `).replace(/8/, ` :eight: `).replace(`9`, ` :nine: `).replace(/0/, ` :zero: `)}`) 
}, 3000);  })
const invites = {};

const wait = require("util").promisify(setTimeout);

client.on("ready", () => {
  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(codare => {
      invites[g.id] = codare;
    });
  });
});

client.on("guildMemberAdd", async member => {// chimp#0110
const data = require('quick.db')
const user = client.users.get(member.id);
  
member.guild.fetchInvites().then(async codare => {
let channel = await data.fetch(`kanal.${member.guild.id}`);
if (!channel) return;

const ei = invites[member.guild.id];
invites[member.guild.id] = codare;

const seni_kim_davet_etti = await codare.find(i => (ei.get(i.code) == null ? (i.uses - 1) : ei.get(i.code).uses) < i.uses);
const ben_ettim = member.guild.members.get(seni_kim_davet_etti.inviter.id);

data.add(`chimp.${ben_ettim.id}.${member.guild.id}`, +1);
data.add(`toplambebe臒iiiiim.${ben_ettim.id}.${member.guild.id}`, +1);
  
 let zaman = require("moment").duration(new Date().getTime() - client.users.get(member.id).createdAt.getTime())
 if(zaman < 1296000000) { data.add(`chimp.${ben_ettim.id}.${member.guild.id}`, -1);
 data.add(`fake.${ben_ettim.id}_${member.guild.id}`, +1); }
  
 data.set(`seni_kim_davet_etti?.${member.id}.${member.guild.id}`, ben_ettim.id);
  
let 枚l莽_bakal谋m = await data.fetch(`chimp.${ben_ettim.id}.${member.guild.id}`);

let davetsayi;
if(!枚l莽_bakal谋m) { davetsayi = 0; } 
else { davetsayi = await data.fetch(`chimp.${ben_ettim.id}.${member.guild.id}`); }
  
if(zaman < 1296000000){
member.guild.channels.get(channel).send(`**${member.user.username}** (**fake**), sunucuya **${ben_ettim.user.tag}** (**${davetsayi}**) sayesinde giri艧 yapt谋.`);
ben_ettim.send(`**${member.user.username}** isimli kullan谋c谋 **${member.guild.name}** sunucusuna sizin sayenizde giri艧 yapt谋.
Kullan谋c谋 fake oldu臒u i莽in davet say谋n谋z g眉ncellenmedi.`)
} else {
member.guild.channels.get(channel).send(`**${member.user.username}**, sunucuya **${ben_ettim.user.tag}** (**${davetsayi}**)  sayesinde giri艧 yapt谋.`);
ben_ettim.send(`**${member.user.username}** isimli kullan谋c谋 **${member.guild.name}** sunucusuna sizin sayenizde giri艧 yapt谋.
Yeni davet say谋n谋z **${davetsayi}** olarak g眉ncellendi.`)
  }});
});// codare

client.on("guildMemberRemove", async member => {// chimp#0110
const data = require('quick.db')
const user = client.users.get(member.id);
  
member.guild.fetchInvites().then(async codare => {
let channel = await data.fetch(`kanal.${member.guild.id}`);
if (!channel) return;
const seni_kim_davet_etti = await data.fetch(`seni_kim_davet_etti?.${member.id}.${member.guild.id}`);
const ben_ettim = member.guild.members.get(seni_kim_davet_etti);
  
let zaman = require("moment").duration(new Date().getTime() - client.users.get(member.id).createdAt.getTime())

if(zaman < 1296000000){
  data.add(`fake.${ben_ettim.id}.${member.guild.id}`, -1);
  data.add(`chimp.${ben_ettim.id}.${member.guild.id}`, -1);
  if(seni_kim_davet_etti) {
  data.delete(`seni_kim_davet_etti?.${member.id}.${member.guild.id}`); }
} else {
  data.add(`chimp.${ben_ettim.id}.${member.guild.id}`, -1);
  if(seni_kim_davet_etti) {
  data.delete(`seni_kim_davet_etti?.${member.id}.${member.guild.id}`); } }
  
const davetsayi = await data.fetch(`chimp.${ben_ettim.id}.${member.guild.id}`);
if(zaman < 1296000000){
if(!seni_kim_davet_etti) {
return member.guild.channels.get(channel).send(`**${member.user.username}** (**fake**), sunucudan 莽谋k谋艧 yapt谋. (davet eden bulunamad谋)`);
} else {
member.guild.channels.get(channel).send(`**${member.user.username}** (**fake**), sunucudan 莽谋k谋艧 yapt谋. Davet eden: ${ben_ettim.user.tag} (**${davetsayi ? davetsayi : '0'}**)`); }
ben_ettim.send(`**${member.user.username}** isimli kullan谋c谋 **${member.guild.name}** sunucusuna siz davet etmi艧tiniz, 艧imdi 莽谋k谋艧 yapt谋.
Kullan谋c谋 fake oldu臒u i莽in davet say谋n谋z g眉ncellenmeid.`)
} else {
if(!seni_kim_davet_etti) {
return member.guild.channels.get(channel).send(`**${member.user.username}**, sunucudan 莽谋k谋艧 yapt谋. (davet eden bulunamad谋)`); 
} else {
member.guild.channels.get(channel).send(`**${member.user.username}**, sunucudan 莽谋k谋艧 yapt谋. Davet eden: **${ben_ettim.user.tag}** (**${davetsayi ? davetsayi : '0'}**)`); }
ben_ettim.send(`**${member.user.username}** isimli kullan谋c谋 **${member.guild.name}** sunucusuna siz davet etmi艧tiniz, 艧imdi 莽谋k谋艧 yapt谋.
Yeni davet say谋n谋z **${davetsayi}** olarak g眉ncellendi.`)
}
})
});
client.on('guildMemberAdd', async member => {// can#0002

  const database = require('quick.db');
  if(member.user.bot) return;
  
  const kanal = member.guild.channels.cache.get(await database.fetch(`fake-channel.${member.guild.id}`) || 0);
  const zaman = await database.fetch(`fake-time.${member.guild.id}`);
  const rol = member.guild.roles.cache.get(await database.fetch(`fake-role.${member.guild.id}`) || 0);
  if(!kanal || !zaman || !rol) return;

  if(member.user.createdAt.getTime() < require('ms')(zaman)) {

    member.roles.add(rol.id);
    const embed = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle('Fake Sistem Yakaland谋')
    .setDescription(`**${member.user.tag}** Fake sistemine tak谋ld谋!`);
    return kanal.send(embed);

  } else return;

});
client.on('message', async msg => {
  let prefix = ayarlar.prefix 
const embed = new Discord.MessageEmbed()
.setTitle('Prefixim:')
.setDescription('Prefix:r.')
.setColor('RANDOM')
  if(msg.content == `<@!821451217921769473>`) return msg.channel.send(embed);
});
////////////////////
client.on("guildMemberRemove",  member =>{
  const gereksiz = qdb.fetch(`dmhgbb_${member.guild.id}`);
  if (gereksiz === "aktif") {
  const hg = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle(member.guild.name + '\n G枚r眉艧眉r眉z!')
  .setDescription(`Umar谋m bizimle vakit ge莽irirken mutlu olmu艧sundur!`)
  .setFooter('G枚r眉艧眉r眉z')
  .setTimestamp()
  member.send(hg)
}else if (gereksiz === "deaktif") {
}
if (!gereksiz) return;
});

client.on("guildMemberAdd", async member => {
let kanal = await qdb.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-a莽"
  if (!kanal) return;  
  var cod = member.guild.owner
  if (member.user.bot === true) {
     if (qdb.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let are = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL)
      .setDescription(`**${member.user.tag}** (${member.id}) adl谋 bota bir yetkili verdi e臒er kald谋rmak istiyorsan谋z **R!bot-izni kald谋r botun_id**.`);
    cod.send(are);
     } else {
       let izinverilmemi艧bot = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL)
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "adl谋 bot sunucuya eklendi ve banlad谋m e臒er izin vermek istiyorsan谋z **r.bot-izni ver botun_id**")
       member.kick();// E臒er sunucudan atmak istiyorsan谋z ban k谋sm谋n谋 kick yap谋n
       cod.send(izinverilmemi艧bot)
}
  }
});
const backup = () => {
    fs.copyFile('./json.sqlite', `./backups/yedekleme 鈥� ${moment().format('D-M-YYYY 鈥� H.mm.ss')} 鈥� laura.sqlite`, err => {
        if (err) return console.log(err);
        console.log('Veritaban谋n谋 yedekledim.');
    });
};

client.on('ready', () => {
    setInterval(() => backup(), 1000 * 60 * 60 * 24); // G眉nde bir kere yedekler.
});
const logs = require("discord-logs")
logs(client);

client.on('guildMemberBoost', (member) => {
  if(!member.guild) return;
  let boost = qdb.fetch(`boostmesaj_${member.guild.id}`) || 'Sunucuya Boost Bast谋臒谋n 陌莽in Te艧ekk眉rler'
  let kanal = qdb.fetch(`boostlog_${member.guild.id}`) || 'Ayarlanmam谋艧'
  if(kanal !== 'Ayarlanmam谋艧') {
  const s = new Discord.MessageEmbed()
  .setColor("#ffd5d5")
  .setTitle(``)
  .setDescription(`${member.user}, ${boost}`)
  client.guilds.cache.get(member.guild.id).channels.cache.get(kanal).send(s).then(function(i){
        i.react(":kalp_boost:835922700760907777")
    })
  } else {
    return;
  }
});
const codleak = require('discord-logs');

codleak(client);

client.on('guildMemberBoost', async member => {

let guild = member.guild;

if(member.user.bot) return;

let rol = await qdb.fetch(`boostrol_${member.guild.id}`)

guild.members.cache.get(member.user.id).roles.add(rol);

});
client.on("message", async message => {
  if (message.author.bot) return;
   let yaz谋lar = qdb.fetch(`${message.guild.id}.otocevap.yaz谋lar`)
   let cevaplar = qdb.fetch(`${message.guild.id}.otocevap.cevaplar`)
  var efe = ""
  let sunucuad谋 = message.guild.name
  let 眉yesay谋 = message.guild.members.cache.size
      for (var i = 0; i < (qdb.fetch(`${message.guild.id}.otocevap.yaz谋lar`) ? qdb.fetch(`${message.guild.id}.otocevap.yaz谋lar`).length : 0); i++) {
    if (message.content.toLowerCase() == yaz谋lar[i].toLowerCase()) {
        efe += `${cevaplar[i].replace("{sunucuad谋}", `${sunucuad谋}`).replace("{眉yesay谋}", `${眉yesay谋}`)}`
        message.channel.send(`${efe}`)
    }
}
})
////--------------------GUVENLIK----------------////
client.on("guildMemberAdd", async member => {
  var rahzamgvnl = `<@${member.id}>`
  var rahzam = await db.fetch(`hggvnl_${member.guild.id}`)
  let user = client.users.cache.get(member.id);
  let kullan谋c谋 = client.users.cache.get(member.id)
  const hesapkk = new Date().getTime()- kullan谋c谋.createdAt.getTime();
  const tmbb = new Date().getTime()- kullan谋c谋.createdAt.getTime();
    let durum;
  if (hesapkk < 1296000000) durum = '艦眉pheli!'
  if (hesapkk > 1296000000) durum = 'G眉venli!'
  if(!rahzam) return;
  let tmb;
  if (tmbb < 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133013248442438/carp.png'
  if (tmbb > 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133016024940554/tik.png'
  if(!rahzam) return;
    const embed = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setThumbnail(tmb)
    .setDescription(`
    
    
      ${rahzamgvnl} Sunucuya Kat谋ld谋!
      
      G眉venlik Durumu : **${durum}**
    
      Hesab谋n谋n Kurulu艧 Tarihi:   ${moment(member.user.createdAt).format("**DD MMMM YYYY**") }
    
    
    `)
  

    client.channels.cache.get(rahzam).send(embed);
  })


client.on("guildMemberRemove", async member => {
  var rahzamgvnl = `<@${member.id}>`
  var rahzam = await db.fetch(`bbgvnl_${member.guild.id}`)
  let user = client.users.cache.get(member.id);
  let kullan谋c谋 = client.users.cache.get(member.id)
  const hesapkk = new Date().getTime()- kullan谋c谋.createdAt.getTime();
  const tmbb = new Date().getTime()- kullan谋c谋.createdAt.getTime();
    let durum;
  if (hesapkk < 1296000000) durum = '艦眉pheliydi!'
  if (hesapkk > 1296000000) durum = 'G眉venliydi!'
  if(!rahzam) return;

  let tmb;
  if (tmbb < 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133013248442438/carp.png'
  if (tmbb > 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133016024940554/tik.png'
  if(!rahzam) return;
    const embed = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setThumbnail(tmb)
    .setDescription(`
    
    
      ${rahzamgvnl} Sunucudan Ayr谋ld谋!
      
      G眉venlik Durumu : **${durum}**
    
      Hesab谋n谋n Kurulu艧 Tarihi:   ${moment(member.user.createdAt).format("**DD MMMM YYYY**") }
    
    
    `)
  
    client.channels.cache.get(rahzam).send(embed);
  })
////-------------------GUVENLIK----------------////
const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./database.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "馃帀"
    }//#FF0000
});



client.on('message', async message => {
if (message.content === '!fakeboost') { // Buraya ne yazarsan谋z yazd谋臒谋n谋z 艧eye g枚re 莽al谋艧谋r
  client.emit('guildMemberBoost', message.member || await message.guild.fetchMember(message.author));
    }
});
client.on('message', async message => {
if (message.content === 'fakekat谋l') { // Buraya ne yazarsan谋z yazd谋臒谋n谋z 艧eye g枚re 莽al谋艧谋r
  client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }
})
client.on("message", message => {
  if (message.channel.id === "835112614467469312") return message.react(":tik:835159905870151702");
});

client.on("message", message => {
  if (message.channel.id === "835112614467469312") return message.react(":carpi:835159933950754818");
});
client.on('guildMemberAdd', async(member) => {
 let mute = member.guild.roles.find(r => r.name === "Susturuldu");
let mutelimi = qdb.fetch(`muteli_${member.guild.id + member.id}`)
let s眉re = qdb.fetch(`s眉re_${member.id + member.guild.id}`)
if (!mutelimi) return;
if (mutelimi == "muteli") {
member.addRole(mute.id)
 
member.send("Muteliyken Sunucudan 脟谋kt谋臒谋n i莽in Yeniden Mutelendin!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten a莽谋ld谋.`)
qdb.delete(`muteli_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Muten a莽谋ld谋.`)
    member.removeRole(mute.id);
  }, ms(s眉re));
}
})
client.on("guildMemberAdd", async member => {
const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./jsonlar/gc.json", "utf8"));
  
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
        let username = member.user.username;
   
            const bg = await Jimp.read("https://i.postimg.cc/LXrHDVJC/guildAdd.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    hgK.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        let hgm = JSON.parse(fs.readFileSync("./jsonlar/hgm.json", "utf8"));
    const hgmK = member.guild.channels.get(hgm[member.guild.id].gkanal)
    var kullanici = member.tag
    var sunucu = member.guild.name
    hgmK.send(`${gc[member.guild.id].mesaj}`)
    })
client.on("guildMemberRemove", async member => {
const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./jsonlar/gc.json", "utf8"));
    const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
        let username = member.user.username;
         
                        const bg = await Jimp.read("https://i.postimg.cc/zGJqxvfr/guild-Remove.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    hgK.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        
    })
    client.on('guildMemberAdd',async member => {
  let user = client.users.get(member.id);
  let chan = client.channels.get(qdb.fetch(`guvenlik${member.guild.id}`)) 
       const Canvas = require('canvas')
       const canvas = Canvas.createCanvas(360,100);
       const ctx = canvas.getContext('2d');
  
  const resim1 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614151181752860672/yhosgeldirrn.png')
    const resim2 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614164419768877056/yhosgeldirrn.png')
    const kurulus = new Date().getTime() - user.createdAt.getTime();
    const g眉n = moment(kurulus).format("dddd")
    var kontrol;
      if (kurulus > 2629800000) kontrol = resim2
    if (kurulus < 2629800000) kontrol = resim1

       const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614164413318168606/Adsz.png');
       ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   


  const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
  ctx.drawImage(kontrol,0,0,canvas.width, canvas.height)
  ctx.beginPath();
	ctx.lineWidth = 4;
  ctx.fill()
	ctx.lineWidth = 4;
  ctx.arc(180, 46, 36, 0, 2 * Math.PI);
	ctx.clip();
  ctx.drawImage(avatar, 143,10, 73, 72  );

   
       const attachment = new Discord.Attachment(canvas.toBuffer(), 'STARKs-g眉venlik.png');
    chan.send(attachment)
});
client.on('ready', () => {
  client.guilds.cache.forEach(guild => {
  guild.members.cache.forEach(async member => {
  const Veri脟ekici = await database.fetch(member.user.id);
  if(!Veri脟ekici) return;
  if((Date.now() <= Veri脟ekici.Biti艧) || Veri脟ekici) {
  let kalan = Veri脟ekici.Biti艧 - Date.now();
  setTimeout(() => {
  database.delete(member.user.id)
  }, kalan);
  };
  });
  });
  });
  ////--------------------GUVENLIK----------------////
client.on("guildMemberAdd", async member => {
  var rahzamgvnl = `<@${member.id}>`
  var rahzam = await db.fetch(`hggvnl_${member.guild.id}`)
  let user = client.users.cache.get(member.id);
  let kullan谋c谋 = client.users.cache.get(member.id)
  const hesapkk = new Date().getTime()- kullan谋c谋.createdAt.getTime();
  const tmbb = new Date().getTime()- kullan谋c谋.createdAt.getTime();
    let durum;
  if (hesapkk < 1296000000) durum = '艦眉pheli!'
  if (hesapkk > 1296000000) durum = 'G眉venli!'
  if(!rahzam) return;
  let tmb;
  if (tmbb < 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133013248442438/carp.png'
  if (tmbb > 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133016024940554/tik.png'
  if(!rahzam) return;
    const embed = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setThumbnail(tmb)
    .setDescription(`
    
    
      ${rahzamgvnl} Sunucuya Kat谋ld谋!
      
      G眉venlik Durumu : **${durum}**
    
      Hesab谋n谋n Kurulu艧 Tarihi:   ${moment(member.user.createdAt).format("**DD MMMM YYYY**") }
    
    
    `)
  

    client.channels.cache.get(rahzam).send(embed);
  })


client.on("guildMemberRemove", async member => {
  var rahzamgvnl = `<@${member.id}>`
  var rahzam = await db.fetch(`bbgvnl_${member.guild.id}`)
  let user = client.users.cache.get(member.id);
  let kullan谋c谋 = client.users.cache.get(member.id)
  const hesapkk = new Date().getTime()- kullan谋c谋.createdAt.getTime();
  const tmbb = new Date().getTime()- kullan谋c谋.createdAt.getTime();
    let durum;
  if (hesapkk < 1296000000) durum = '艦眉pheliydi!'
  if (hesapkk > 1296000000) durum = 'G眉venliydi!'
  if(!rahzam) return;

  let tmb;
  if (tmbb < 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133013248442438/carp.png'
  if (tmbb > 1296000000) tmb = 'https://cdn.discordapp.com/attachments/831129091519414272/831133016024940554/tik.png'
  if(!rahzam) return;
    const embed = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setThumbnail(tmb)
    .setDescription(`
    
    
      ${rahzamgvnl} Sunucudan Ayr谋ld谋!
      
      G眉venlik Durumu : **${durum}**
    
      Hesab谋n谋n Kurulu艧 Tarihi:   ${moment(member.user.createdAt).format("**DD MMMM YYYY**") }
    
    
    `)
  
    client.channels.cache.get(rahzam).send(embed);
  })
////-------------------GUVENLIK----------------////

client.on('guildMemberAdd', member => {
     let kanal = db.fetch(`g眉venlik.${member.guild.id}`)
     if(!kanal) return;

       let aylar = {
               "01": "Ocak",
               "02": "艦ubat",
               "03": "Mart",
               "04": "Nisan",
               "05": "May谋s",
               "06": "Haziran",
               "07": "Temmuz",
               "08": "A臒ustos",
               "09": "Eyl眉l",
               "10": "Ekim",
               "11": "Kas谋m",
               "12": "Aral谋k"
    }

  let biti艧 = member.user.createdAt
      let g眉n眉 = moment(new Date(biti艧).toISOString()).format('DD')
      let ay谋 = moment(new Date(biti艧).toISOString()).format('MM').replace("01", "Ocak").replace("02","艦ubat").replace("03","Mart").replace("04", "Nisan").replace("05", "May谋s").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "A臒ustos").replace("09", "Eyl眉l").replace("10","Ekim").replace("11","Kas谋m").replace("12","Aral谋k").replace("13","CodAre")//codare
     let y谋l谋 =  moment(new Date(biti艧).toISOString()).format('YYYY')
     let saati = moment(new Date(biti艧).toISOString()).format('HH:mm')

let g眉nay = `${g眉n眉} ${ay谋} ${y谋l谋} ${saati}`  

      let s眉re = member.user.createdAt
      let g眉n = moment(new Date(s眉re).toISOString()).format('DD')
      let hafta = moment(new Date(s眉re).toISOString()).format('WW')
      let ay = moment(new Date(s眉re).toISOString()).format('MM')
      let ayy = moment(new Date(s眉re).toISOString()).format('MM')
      let y谋l =  moment(new Date(s眉re).toISOString()).format('YYYY')
     let y谋l2 = moment(new Date().toISOString()).format('YYYY')

     let nety谋l = y谋l2 - y谋l

     let created = ` ${nety谋l} y谋l  ${ay} ay ${hafta} hafta ${g眉n} g眉n 枚nce`

     let kontrol;
     if(s眉re < 1296000000) kontrol = 'Bu hesap 艧眉pheli!'
     if(s眉re > 1296000000) kontrol = 'Bu hesap g眉venli!'

     let codare = new Discord.MessageEmbed()
     .setColor('GREEN')
     .setTitle(`${member.user.username} Kat谋ld谋`)
     .setDescription('<@'+member.id+'> Bilgileri : \n\n  Hesap olu艧turulma tarihi **[' + created + ']** (`' + g眉nay + '`) \n\n Hesap durumu : **' + kontrol + '**')//codare
     .setTimestamp()
     client.channels.cache.get(kanal).send(codare)
})

client.on("guildMemberRemove", async member => {
  //let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/g莽.json", "utf8"));
  //const canvaskanal = member.guild.channels.cache.get(resimkanal[member.guild.id].resim);
  
  if (qdb.has(`g莽kanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(qdb.fetch(`g莽kanal_${member.guild.id}`));
  if (!canvaskanal) return;

  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucudan Ayr谋ld谋."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let msj = await qdb.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/Wrn1XW.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-g眉le-g眉le.png"
  );

    canvaskanal.send(attachment);
    canvaskanal.send(
      msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
    );
    if (member.user.bot)
      return canvaskanal.send(`馃 Bu bir bot, ${member.user.tag}`);
  
});

client.on("guildMemberAdd", async member => {
  if (qdb.has(`g莽kanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(qdb.fetch(`g莽kanal_${member.guild.id}`));

  if (!canvaskanal || canvaskanal ===  undefined) return;
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucuya Kat谋ld谋."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let paket = await qdb.fetch(`pakets_${member.id}`);
  let msj = await qdb.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/UyVZ4f.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) ;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-hosgeldin.png"
  );

  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`馃 Bu bir bot, ${member.user.tag}`);
});


const mySecret = process.env['token']
client.login(mySecret)
