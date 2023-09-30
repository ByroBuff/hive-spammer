const fs = require("fs");
const mineflayer = require("mineflayer");
let bot;

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
process.on('warning', e => console.warn(e.stack));

let loggedIn = false;

colors = {
  black: "\x1b[30m",
  lightblack: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
};

function banner() {
  // clear console
  console.clear();
  banner = `
${colors.yellow}         ┓┏┳┓┏┏┓  ┏┓┏┓┏┓┳┳┓┳┳┓┏┓┳┓
${colors.yellow}         ┣┫┃┃┃┣   ┗┓┃┃┣┫┃┃┃┃┃┃┣ ┣┫
${colors.yellow}         ┛┗┻┗┛┗┛  ┗┛┣┛┛┗┛ ┗┛ ┗┗┛┛┗                      
${colors.yellow}                               
${colors.white}                .' '.            ${colors.lightblack}__
${colors.white}       .        .   .           ${colors.lightblack}(__\\_
${colors.white}        .         .         . ${colors.lightblack}-${colors.yellow}{${colors.yellow}{${colors.lightblack}_${colors.yellow}(|${colors.white}8${colors.yellow})
${colors.white}          ' .  . ' ' .  . '     ${colors.lightblack}(__/

${colors.yellow}     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`;
  console.log(banner);
}

banner();

const placeholders = {
  "{name}": function () {
    return Object.keys(bot.players)[Math.floor(Math.random() * Object.keys(bot.players).length)];
    },
  "{discord}": function () {
    return "dsc.gg/publichive"
  },
  "{coord}": function () {
    let coord = Math.floor(Math.random() * 20000000) - 10000000;
    if (coord > -100000 && coord < 100000) return this.coord();
    return coord;
  },
  "{bypass}": function () {
    return Math.random().toString(36).substring(2, 18);
  },
  "{date}": function () {
    return new Date().toLocaleDateString();
  },
  "{num}": function () {
    // random number between 100 and 300
    return Math.floor(Math.random() * 200) + 100;
  },
  "{owner}": function () {
    let owners = [
      "ByroBuff",
      "CapyKing10",
      "lerpietong",
      "myniany"
    ]
    return owners[Math.floor(Math.random() * owners.length)];
  },
};

const main = () => {
  bot = mineflayer.createBot({
    host: "anarchy.6b6t.org",
    username: config.username,
    version: "1.19.4",
    skipValidation: true,
  });

  bot.once("login", async () => {
    bot.chat("/login " + config.password);
    await bot.waitForTicks(40);
    let sent = 0;

    while (loggedIn) {
      // select random message from config
      let message = config.messages[Math.floor(Math.random() * config.messages.length)];

      // replace placeholders
      for (let placeholder in placeholders) {
        while (message.includes(placeholder)) {
          message = message.replace(placeholder, placeholders[placeholder]());
        }
      }

      sent++;
      bot.chat(message);

      if (message.startsWith("<")) {
        messageColor = colors.green;
      } else {
        messageColor = colors.white;
      }
      if (!config.debug) {
      process.stdout.clearLine();

      process.stdout.write(`${colors.lightblack}[${colors.yellow}»${colors.lightblack}] ${colors.lightblack}(${colors.yellow}${sent}${colors.lightblack}) ${messageColor}${message}${colors.reset}\r`)
      } else {
        console.log(`${colors.lightblack}[${colors.yellow}»${colors.lightblack}] ${colors.lightblack}(${colors.yellow}${sent}${colors.lightblack}) ${messageColor}${message}${colors.reset}`)
      }
      await bot.waitForTicks(config.delay);
    }
  });

  bot.on("message", (msg) => {
    if (msg.toString() == "Welcome to 6b6t.org, " + config.username + "!") {
      loggedIn = true;
      console.log(`${colors.lightblack}[${colors.green}+${colors.lightblack}] ${colors.yellow}${config.username} ${colors.lightblack}Logged in!${colors.reset}`);
      console.log("")
    }
  });

  bot.on("error", (err) => {
    console.log(err);
    bot.end();
  });

  if (config.debug) {
    bot.on("messagestr", (msg) => {
      if (msg.startsWith("<")) {
        msg = colors.green + msg;
      } else {
        msg = colors.white + msg;
      }
      console.log(msg);
    });
  }


  bot.on("kicked", (err) => {
    console.log(err);
    bot.end();
  });

  bot.on("end", () => {
    bot.removeAllListeners();
    setTimeout(main, 5000);
  });
};

main();