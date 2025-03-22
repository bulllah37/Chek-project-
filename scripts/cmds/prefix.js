module.exports = {
 config: {
	 name: "prefix",
	 version: "1.0",
	 author: "Tokodori_Frtiz",//remodified by cliff
	 countDown: 3,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "auto 🪐",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "prefix") {
 return message.reply({
 body: `
𝗬𝗢, 𝗠𝗬 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗦  [  /  ]\n
𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:
➥ ✓𝖍𝖊𝖑𝖕 [number of page] -> see commands
➥ ✓BBY [message] -> talk to bot
➥ ✓𝖈𝖆𝖑𝖑𝖊𝖉 [message] -> report any problem encountered
➥ ✓help [command] -> information and usage of command\n\n𝗛𝗔𝗩𝗘 𝗙𝗨𝗡 𝗨𝗦𝗜𝗡𝗚 𝗜𝗧 𝗘𝗡𝗝𝗢𝗬!🐱\n𝗕𝗢𝗧 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥:𝕽𝖆𝖎𝖍𝖆𝖓`,
 attachment: await global.utils.getStreamFromURL("https://cdn.discordapp.com/attachments/1342902099331121194/1350775400212463657/THE_SHUTDOWN_Camille_Unknown.gif?ex=67d7f71f&is=67d6a59f&hm=d6085af2b2d43a98943548b8d1d5e88f0293b6f8df16606baee31cf6d52330fa&")
 });
 }
 }
}
