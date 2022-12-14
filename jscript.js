import TextScramble from './TextScramble';
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
let characterChangeTimeStart = 50; //ช่วงเวลาเปลี่ยนตัวอักษร ตอนเริ่ม
let characterChangeTimeEnd = 50; //ช่วงเวลาเปลี่ยนตัวอักษร  ตอนจบ
let speedChange = timeDelay(1); // เว้นช่วงช่องไฟระหว่างการเปลี่ยนตัว


let runStatus = true;
let countTime = 1;
let maxTime = 10;

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————
// const phrases = [];
const phrases = [
  'สิรภพ โชติพาณิชย',
'ปีวรา แสงตะวัน',
'สราวลี ขจรเกียรติสกุล',
'ขรรค์ ไกรรอด',
'กนกพล สรพินิจ',
'อภิลดา ศิริพัฒน์',
'ดารินทร์ ปรีชาวงศ',
'ชนนิกา อรุณฉาย',
'ชลนิภา ปรีดาศิริกุล',
'ติณณภพ เดชบุญ'
];

// endSettings

const el = document.querySelector(".text");
const fx = new TextScramble(el);



const next = () => {
  let indexLenth = getRndInteger(0, phrases.length);
  fx.setText(phrases[indexLenth],characterChangeTimeStart,characterChangeTimeEnd).then(() => {
    if (runStatus) {
      setTimeout(next, speedChange);
    } else {
      console.log(runStatus);
      return false;
    }
  });
  console.log("ลำดับสุ่มแสดง : " + indexLenth);
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

  fx.setText(phrases[resut],600,500);
};
