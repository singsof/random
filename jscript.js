class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText, characterChangeTimeStart, characterChangeTimeEnd) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * characterChangeTimeStart);
      // console.log(start)
      const end = start + Math.floor(Math.random() * characterChangeTimeEnd);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    // audio.pause();
    // audio.currentTime = 0;
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < specialCharactersSpeed) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const removeItemSt = (name, txtArrayID) => {
  localStorage.removeItem(name);
  document.getElementById(txtArrayID).value = "";
  localStorage.setItem(name, "");
  phrases = [];
};
const removeItemStReward = (name, tableID) => {
  let stinHtml = " <tr> <th>รหัส</th><th>ชื่อ</th></tr>";
  localStorage.removeItem(name);
  document.getElementById(tableID).innerHTML = stinHtml;
  localStorage.setItem(name, "");
};
// Settings Functions

// สุ่ม ต่ำ - สูงสุด
const timeDelay = (second) => {
  return second * 1000;
}; //ความเร็วในการสลับตัว

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

//  startSettings ค่าเรริ่มต้น
// ——————————————————————————————————————————————————
const el = document.querySelector(".text");
let phrases = [];

const updateData = () => {
  if (localStorage.getItem("dataRandom") !== "") {
    let dataRandom = JSON.parse(localStorage.getItem("dataRandom"));
    phrases = dataRandom;
  }
};

updateData();

const updateReward = (tableID) => {
  let stinHtml = " <tr> <th>รหัส</th><th>ชื่อ</th></tr>";
  const reward = JSON.parse(localStorage.getItem("reward"));
  reward.forEach((value) => {
    stinHtml +=
      "<tr>" +
      "<td>" +
      value.key +
      "</td>" +
      "<td>" +
      value.name +
      "</td>" +
      "</tr>";
  });

  document.getElementById(tableID).innerHTML = stinHtml;
};

const addReward = (value) => {
  let rewardArrayValue = [];
  if (localStorage.getItem("reward") == "") {
    rewardArrayValue.push(value);
    localStorage.setItem("reward", JSON.stringify(rewardArrayValue));
  } else {
    let resutReward = JSON.parse(localStorage.getItem("reward"));
    rewardArrayValue = resutReward;
    rewardArrayValue.push(value);
    localStorage.setItem("reward", JSON.stringify(rewardArrayValue));
  }
};

// ——————————————————————————————————————————————————

let specialCharactersSpeed; //ความเร็วในการเปลี่ยนอักษรพิเศษ
const specialCharactersSpeedFN = (ev, txt) => {
  // console.log(ev.value)
  specialCharactersSpeed = ev.value;
  console.log(specialCharactersSpeed);
  document.getElementById(txt).innerHTML = specialCharactersSpeed;
};

let characterChangeTimeEnd; //ช่วงเวลาเปลี่ยนตัวอักษร  ตอนจบ
let characterChangeTimeStart; //ช่วงเวลาเปลี่ยนตัวอักษร ตอนเริ่ม
const characterChangeTimeStartFN = (ev, txt) => {
  characterChangeTimeStart = ev.value * -1;
  characterChangeTimeEnd = characterChangeTimeStart;
  console.log(characterChangeTimeStart);
  document.getElementById(txt).innerHTML = characterChangeTimeStart;
};


let speedChange = 100; // เว้นช่วงช่องไฟระหว่างการเปลี่ยนตัว
const speedChangeFN = (ev, txt) => {
  speedChange = ev.value;
  console.log(speedChange);
  document.getElementById(txt).innerHTML = speedChange;
};

let runStatus = true; // สถานะเริ่มหรือ หยุด
let countTime = 1;
let maxTime = 10; // ตั้งค่าเวลา
const maxTimeFN = (ev, txt) => {
  maxTime = ev.value;
  console.log(maxTime);
  document.getElementById(txt).innerHTML = maxTime;
};


// Setup
const SETUP = () =>{
   specialCharactersSpeed = .28; //ความเร็วในการเปลี่ยนอักษรพิเศษ
   characterChangeTimeEnd = 2; //ช่วงเวลาเปลี่ยนตัวอักษร  ตอนจบ
   characterChangeTimeStart  = 2; //ช่วงเวลาเปลี่ยนตัวอักษร ตอนเริ่ม
   speedChange = 100; // เว้นช่วงช่องไฟระหว่างการเปลี่ยนตัว
   maxTime = 10;
}

SETUP();




let RewardAudio = new Audio();
const RewardAudioFN = (ev) => {
  // RewardAudio.load();
  RewardAudio = new Audio("audio/" + ev.value);
  // document.getElementById(txt).innerHTML = ev.text;
};

let audio = new Audio();
const audioNew = (ev) => {
  audio.load();
  audio = new Audio("audio/" + ev.value);
  audio.loop = true;
  // document.getElementById(txt).innerHTML = ev.text;
};

const audioPlay = (audio) => {
  // audio.volume = 0.2;
  if (audio.paused) {
    audio.play();
  }
};
const audioStop = (audio) => {
  audio.pause();
  audio.currentTime = 0;
  audio.load();
};

const removeClass = (nameID, ClassName) => {
  let element = document.getElementById(nameID);
  element.classList.remove(ClassName);
};
const AddClass = (nameID, ClassName) => {
  let element = document.getElementById(nameID);
  element.classList.add(ClassName);
};

// bodyx
// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————




// endSettings
const fx = new TextScramble(el);
let countNumber = 1;
const next = (TimeDateStart) => {
  let TimeNowRandom = new Date();
  let TimeStartRandom = new Date(TimeDateStart);
  let TimeEndRandom = new Date(TimeStartRandom);
  TimeEndRandom.setTime(TimeStartRandom.getTime() + maxTime * 1000);

  let indexLenth = getRndInteger(0, phrases.length);
  fx.setText(
    phrases[indexLenth].name,
    characterChangeTimeStart,
    characterChangeTimeEnd
  ).then(() => {
    const LeanTime = (TimeNow, TimeEnd) => {
      let TimeSeconds = TimeNow - TimeEnd;

      if (TimeSeconds < 0) {
        TimeSeconds = TimeSeconds * -1;
      }
      return TimeSeconds;
    };

    // let TimeOut =  TimeEndRandom.getSeconds() - TimeNowRandom.getSeconds() ;

    // if()

    let countTime = LeanTime(
      TimeEndRandom.getSeconds(),
      TimeNowRandom.getSeconds()
    );

    if (countTime < 6) {
      console.log(countTime);
      // characterChangeTimeEnd = 60;
      // characterChangeTimeStart = 60;
      // speedChange = 1000
      // specialCharactersSpeed = .28
    }

    if (TimeNowRandom.getTime() >= TimeEndRandom.getTime()) {
      audioStop(audio);
      // console.log()

      let resutIndex = getRndInteger(0, phrases.length); // คำตอบ
      fx.setText(phrases[resutIndex].name, 100, 100);

      addReward(phrases[resutIndex]);

      runStatus = false;
    }

    if (runStatus === true) {
      if (countNumber % 2 == 0) {
        removeClass("bodyx", "setBackgroundColor");
      } else {
        AddClass("bodyx", "setBackgroundColor");
      }

      countNumber++;

      setTimeout(next(TimeDateStart), speedChange);
    }
    if (runStatus === false) {
      removeClass("bodyx", "setBackgroundColor");
      audioPlay(RewardAudio);

      return false;
    }
  });

  console.log("ลำดับสุ่มแสดง : " + indexLenth);
};

const startRandom = (textID, btnID) => {

  if (phrases == "") {
    alert("กรุณาเพิ่มข้อมูล");
    $("#addata").modal("toggle");
    return false;
  }

  audioPlay(audio);

  const TimeDateStart = new Date();
  runStatus = true;
  document.getElementById(textID).style.display = "block";
  document.getElementById(btnID).style.display = "none";
  next(TimeDateStart);
};

const stopRandom = (textID, btnID) => {
  audioStop(audio);
  runStatus = false;
};
