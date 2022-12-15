class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "000!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText, characterChangeTimeStart = 40, characterChangeTimeEnd = 40) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * characterChangeTimeStart);
      const end = start + Math.floor(Math.random() * characterChangeTimeEnd);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  stop() {
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
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

//   alert("Please enter")

  // $("#table-hi").empty();
  document.getElementById(tableID).innerHTML = stinHtml;
  // $("#table-hi").html(stinHtml)
};

// ——————————————————————————————————————————————————

let specialCharactersSpeed = 0.28; //ความเร็วในการเปลี่ยนอักษรพิเศษ
const specialCharactersSpeedFN = (ev, txt) => {
  // console.log(ev.value)
  specialCharactersSpeed = ev.value;
  console.log(specialCharactersSpeed);
  document.getElementById(txt).innerHTML = specialCharactersSpeed;
};

let characterChangeTimeStart = 40; //ช่วงเวลาเปลี่ยนตัวอักษร ตอนเริ่ม
const characterChangeTimeStartFN = (ev, txt) => {
  characterChangeTimeStart = ev.value;
  console.log(characterChangeTimeStart);
  document.getElementById(txt).innerHTML = characterChangeTimeStart;
};

let characterChangeTimeEnd = 40; //ช่วงเวลาเปลี่ยนตัวอักษร  ตอนจบ
const characterChangeTimeEndFN = (ev, txt) => {
  characterChangeTimeEnd = ev.value;
  console.log(characterChangeTimeEnd);
  document.getElementById(txt).innerHTML = characterChangeTimeEnd;
};

let speedChange = 400; // เว้นช่วงช่องไฟระหว่างการเปลี่ยนตัว
const speedChangeFN = (ev, txt) => {
  speedChange = ev.value;
  console.log(speedChange);
  document.getElementById(txt).innerHTML = speedChange;
};

let runStatus = true; // สถานะเริ่มหรือ หยุด
let countTime = 1;
let maxTime = 5; // ตั้งค่าเวลา
var audio = new Audio("/audio/m1.mp3");
// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

// endSettings
const fx = new TextScramble(el);

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
    if (TimeNowRandom.getTime() > TimeEndRandom.getTime()) {
      let resutIndex = getRndInteger(0, phrases.length); // คำตอบ
      fx.setText(phrases[resutIndex].name, 500, 500);

      console.log(phrases[resutIndex]);
      // Delete array
      // reward
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

      addReward(phrases[resutIndex]);

      // phrases.splice(resutIndex, 1);

      // console.log(phrases);

      runStatus = false;
    }

    if (runStatus === true) {
      setTimeout(next(TimeDateStart), speedChange);
    }
    if (runStatus === false) {
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
  const TimeDateStart = new Date();

  runStatus = true;
  document.getElementById(textID).style.display = "block";
  document.getElementById(btnID).style.display = "none";

  // console.log(phrases);
  // audio.play();
  next(TimeDateStart);
};

const stopRandom = (textID, btnID) => {
  runStatus = false;
  // let resut = getRndInteger(0, phrases.length); // คำตอบ
  audio.pause();

  // document.getElementById(textID).style.display = "none";
  // document.getElementById(btnID).style.display = "block";
  //   fx.setText(phrases[resut], 70, 80);
};
