 const axios = require("axios");

const getAPIBase = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return data.bs;
};

const sendMessage = (api, threadID, message, messageID) => 
  api.sendMessage(message, threadID, messageID);

const cError = (api, threadID, messageID) => 
  sendMessage(api, threadID, "error🦆💨", messageID);

const teachBot = async (api, threadID, messageID, senderID, teachText) => {
  const [ask, answers] = teachText.split(" - ").map((text) => text.trim());
  if (!ask || !answers) {
    return sendMessage(api, threadID, "Invalid format. Use: {pn} teach <ask> - <answer1, answer2, ...>", messageID);
  }

  const answerArray = answers.split(",").map((ans) => ans.trim()).filter((ans) => ans !== "");

  try {
    const res = await axios.get(
      `${await getAPIBase()}/bby/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(answerArray.join(","))}&uid=${senderID}`
    );
    const responseMsg = res.data?.message === `✨Teaching recorded successfully!\n Your Total Teachings: ${res.data.userStats.user.totalTeachings}`
      ? `Successfully taught the bot!\n📖 Teaching Details:\n- Question: ${res.data.ask}\n- Answers: ${answerArray.join(", ")}\n- Your Total Teachings: ${res.data.userStats.user.totalTeachings}`
      : res.data?.message || "Teaching failed.";
    return sendMessage(api, threadID, responseMsg, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const talkWithBot = async (api, threadID, messageID, senderID, input) => {
  try {
    const res = await axios.get(
      `${await getAPIBase()}/bby?text=${encodeURIComponent(input)}&uid=${senderID}&font=2`
    );
    const reply = res.data?.text || "Please teach me this sentence!🦆💨";
    const react = res.data.react || "🐸";
    return api.sendMessage(reply + react, threadID, (error, info) => {
      if (error) return cError(api, threadID, messageID);
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: senderID,
        msg: reply,
      });
    }, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const botMsgInfo = async (api, threadID, messageID, senderID, input) => {
  try {
    const res = await axios.get(
      `${await getAPIBase()}/bby/msg?ask=${encodeURIComponent(input)}&uid=${senderID}`
    );

    if (!res.data || res.data.status !== "Success" || !Array.isArray(res.data.messages) || res.data.messages.length === 0) {
      return sendMessage(api, threadID, "No matching messages found!🦆💨", messageID);
    }

    const askText = `📜 Ask: ${res.data.ask}\n\n`;
    const answers = res.data.messages.map(msg => `🎀 [${msg.index}] ${msg.ans}`).join("\n");

    const finalMessage = `${askText}${answers}`;

    return sendMessage(api, threadID, finalMessage, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const deleteMessage = async (api, threadID, messageID, senderID, input, event) => {
  const hasan = ["61566533590967"];
  if (!hasan.includes(event.senderID)){
    return message.reply("❕ | you don't have that permission");
  }
  try {
    const [text, index] = input.split(" - ").map((str) => str.trim());

    if (index === undefined) {
      if (!text) {
        return sendMessage(api, threadID, "Invalid format. Use: \n1. {pn} delete <text> \n2. {pn} delete <text> - <indexNumber>", messageID);
      }

      const res = await axios.get(
        `${await getAPIBase()}/bby/delete?text=${encodeURIComponent(text)}&uid=${senderID}`
      );

      if (res.data && res.data.status === "Success") {
        return sendMessage(api, threadID, `✅ Successfully deleted all answers related to: ${text}`, messageID);
      } else {
        return sendMessage(api, threadID, res.data?.message || "❌ Failed to delete the message!", messageID);
      }
    }

    if (isNaN(index)) {
      return sendMessage(api, threadID, "Invalid format. Index must be a number.", messageID);
    }

    const res = await axios.get(
      `${await getAPIBase()}/bby/delete?text=${encodeURIComponent(text)}&index=${index}&uid=${senderID}`
    );

    if (res.data && res.data.status === "Success") {
      return sendMessage(api, threadID, `✅ Successfully deleted answer [Index: ${index}] related to: ${text}`, messageID);
    } else {
      return sendMessage(api, threadID, res.data?.message || "❌ Failed to delete the message!", messageID);
    }
  } catch {
    return cError(api, threadID, messageID);
  }
};

const editMessage = async (api, threadID, messageID, senderID, input, event) => {
  const hasan = ["61566533590967"];
  if (!hasan.includes(event.senderID)){
    return message.reply("❕ | you don't have that permission");
  }
  try {
    const [ask, newAskOrIndex, newAns] = input.split(" - ").map((str) => str.trim());

    if (!ask || (!newAskOrIndex && !newAns)) {
      return sendMessage(api, threadID, "Invalid format. Use:\n1. {pn} edit <ask> - <newAsk>\n2. {pn} edit <ask> - <indexNumber> - <newAnswer>", messageID);
    }

    if (newAskOrIndex && !newAns) {
      const res = await axios.get(
        `${await getAPIBase()}/bby/edit?ask=${encodeURIComponent(ask)}&newAsk=${encodeURIComponent(newAskOrIndex)}&uid=${senderID}`
      );

      const message = res.data?.status === "Success" ? `✅ Successfully updated question to: ${newAskOrIndex}` : res.data?.message || "❌ Failed to update the question!";
      return sendMessage(api, threadID, message, messageID);
    }

    if (newAskOrIndex && newAns) {
      const index = parseInt(newAskOrIndex, 10);

      if (isNaN(index)) {
        return sendMessage(api, threadID, "Invalid format. Index must be a number.", messageID);
      }

      const res = await axios.get(
        `${await getAPIBase()}/bby/edit?ask=${encodeURIComponent(ask)}&index=${index}&newAns=${encodeURIComponent(newAns)}&uid=${senderID}`
      );

      const message = res.data?.status === "Success" ? `✅ Successfully updated answer at index ${index} to: ${newAns}` : res.data?.message || "❌ Failed to update the answer!";
      return sendMessage(api, threadID, message, messageID);
    }
  } catch {
    return cError(api, threadID, messageID);
  }
};

module.exports.config = {
  name: "bbu",
  aliases: ["bbz", "robot"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  description: "Talk with the bot or teach it new responses",
  category: "talk",
  countDown: 3,
  guide: {
    en: `{pn} <text> - Ask the bot something\n{pn} teach <ask> - <answer1, answer2, ...> => Teach the bot a new response\n\n{pn} Hello\n{pn} delete <text> => Delete all answers related to text\n{pn} delete <text> - <index> => Delete specific answer at index\n{pn} edit <Ask> - <New Ask> => update the ask query\n{pn} edit <ask> - <index> - <new answer> => update specific answer at index`,
  },
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  if (args.length === 0) {
    return sendMessage(api, threadID, "Please provide text or teach the bot!", messageID);
  }

  const input = args.join(" ").trim();
  const [command, ...rest] = input.split(" ");

  if (command.toLowerCase() === "teach") {
    return teachBot(api, threadID, messageID, senderID, rest.join(" ").trim());
  }
  if (command.toLowerCase() === "msg") {
    return botMsgInfo(api, threadID, messageID, senderID, rest.join(" ").trim());
  }
  if (command.toLowerCase() === "edit") {
    return editMessage(api, threadID, messageID, senderID, rest.join(" ").trim());
  }
  if (command.toLowerCase() === "delete") {
    return deleteMessage(api, threadID, messageID, senderID, rest.join(" ").trim());
  }
  return talkWithBot(api, threadID, messageID, senderID, input);
};

module.exports.onChat = async ({ api, event, usersData }) => {
  const { threadID, messageID, body, senderID } = event;
  const userName = await usersData.getName(event.senderID);
  const hasan = `✨ ${userName} 💖`;
  const cMessages = [
    "কি হয়ছে বেবি ববি বলে দাকো কেন 🙂",
    "ahm ahm 🐸 dako ken",
    "Ami ekhane bby 🥹",
    "Amake vhule jaw 🤌😫",
    "ki hoiche ki koibi ?",
    "bbu bbu bolte bolte hapi ye geso jaw aktu rest new",
    "ami busy akhon pore daiko 🐱",
    "jaa luccha ",
    "amare dako naki  🐸",
    "ei new jush khaw, bbu bolte bolte hapai gecho 🧃",
    "Amake vhule jao 🥺",
    " Don't disturb me! ",
    "bujhchi tui je Single na hole amare dakti na ekhon ki bolbi bol! 🙂🤌",
    "ei mon tumake dilam 🦆💨",
    " assalamualaikum 💖",
    "kiyo dako keno ? ",
    "kire amake miss kro naki ",
    "কি হইছে আমার কি কাজে লাগবে তুর !?🌚👀",
    "তুই সেই লুইচ্চাটা না !? 🙂🔪",
    "bby daktecho kno 🐸",
    "kmn aso bby 🥹💐",
    "humm blo bbu 🍺",
    "ki hoise ato dako keno😑",
    "এই নেও তোমার জন্য 🍺",
    "কখনো ছেড়ে যাবেনা প্রমিস করো 😅",
    "এখানে কি যাও পড়তে বস 😡",
    "কি হইসে আমাকে কেন ঢাকো যাও তোমার আসল bbu আর কাছে "
    
    
    
    
  ];
  const userInput = body.toLowerCase().trim();

  const keywords = ["bbu", "bby", "robot", "বট", "বাবু", "bot", "hlw", "jan"];

  if (keywords.some((keyword) => userInput.startsWith(keyword))) {
    const isQuestion = userInput.split(" ").length > 1;
    if (isQuestion) {
      const question = userInput.slice(userInput.indexOf(" ") + 1).trim();

      try {
        const res = await axios.get(
          `${await getAPIBase()}/bby?text=${encodeURIComponent(question)}&uid=${senderID}&font=2`
        );
        const replyMsg = res.data?.text || "Please teach me this sentence!🦆💨";
        const react = res.data.react || "💔";

        return api.sendMessage(replyMsg + react, threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
              replyMsg
            });
          }
        }, messageID);
      } catch (error) {
        return api.sendMessage("error🦆💨", threadID, messageID);
      }
    } else {
      const rMsg = `${hasan}\n\n${cMessages[Math.floor(Math.random() * cMessages.length)]}`;
      return api.sendMessage(rMsg, threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
            });
          }
        }, messageID);
    }
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  const { threadID, messageID, senderID, body } = event;
  return talkWithBot(api, threadID, messageID, senderID, body);
};