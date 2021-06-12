const courses = require('./courses.json');

const help = `Select any of the below options to move forward

/term    -- View the terms (or) Change the term

/courses -- List of courses per term! (Term Should be set to view)

/info    -- Information about Bot

/currentTerm -- To view the current term setting
`;

const welcome = `Hey, Welcome to the Course Checker Bot 🤖 

${help}

`;

const browsers = {
  firefox: '/mnt/c/Program Files/Firefox Developer Edition/firefox.exe',
  edge: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  brave:
    '/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  chromium: '/usr/bin/chromium-browser',
};

const splitInToNButtons = (term, splitCount) => {
  // Setup!
  const menu2Buttons = [[{ text: 'Help', callback_data: 'help' }]];
  let tempArray = [];
  let count = 0;

  courses[term].map((item, index, arr) => {
    const localOb = {
      text: item['Course Name'],
      callback_data: item.command,
      index,
    };

    tempArray.push(localOb);
    count += 1;

    if (count === splitCount) {
      count = 0;
      menu2Buttons.push(tempArray);
      tempArray = [];
    } else if (index === arr.length - 1) {
      menu2Buttons.push([localOb]);
    }

    return true;
  });

  return menu2Buttons;
};

const utilities = {
  help,
  welcome,
  browsers,
  splitInToNButtons,
};

module.exports = utilities;
