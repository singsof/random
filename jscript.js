// Settings Functions

// สุ่ม ต่ำ - สูงสุด
const timeDelay = (second) => {
  return second * 1000;
}; //ความเร็วในการสลับตัว

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

//  startSettings ค่าเรริ่มต้น
let specialCharactersSpeed = 0.28; //ความเร็วในการเปลี่ยนอักษรพิเศษ

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————
const phrases = [];
// const phrases = [
//   'สิรภพ โชติพาณิชย',
// 'ปีวรา แสงตะวัน',
// 'สราวลี ขจรเกียรติสกุล',
// 'ขรรค์ ไกรรอด',
// 'กนกพล สรพินิจ',
// 'อภิลดา ศิริพัฒน์',
// 'ดารินทร์ ปรีชาวงศ',
// 'ชนนิกา อรุณฉาย',
// 'ชลนิภา ปรีดาศิริกุล',
// 'ติณณภพ เดชบุญ'
// ];

// endSettings

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "000!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
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

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let runStatus = true;

let countTime = 1;
let maxTime = 10;

let counter = 0;

let speedChange = timeDelay(0.001); // ความเร็วในการสลับตัว

const next = () => {
  let indexLenth = getRndInteger(0, phrases.length);
  fx.setText(phrases[indexLenth]).then(() => {
    if (runStatus) {
      setTimeout(next, speedChange);
    } else {
      console.log(runStatus);
      return false;
    }
  });
  console.log("ลำดับสุ่มแสดง : " + indexLenth);
  // counter = (counter + 1) % phrases.length;
};

const startRandom = (textID, btnID) => {
  if (phrases.length === 0) {
    alert("กรุณาเพิ่มข้อมูล");
    $("#addata").modal("toggle");
    return false;
  }

  runStatus = true;
  document.getElementById(textID).style.display = "block";
  document.getElementById(btnID).style.display = "none";
  // next();
  next();
  //   runTimSecond();
};

const stopRandom = () => {
  runStatus = false;
  let resut = getRndInteger(0, phrases.length); // คำตอบ

  fx.setText(phrases[resut]);
};
