let monthOptions = { month: "long" };
let dayNameOptions = { weekday: "short" };
let dayNumberOptions = { day: "numeric" };
let keyOptions = { year: "numeric", month: "short", day: "numeric" };

function getDaysInMonth(month, year) {
  let dayInMonth = {
    days: [],
    month: "",
  };
  var date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    let dayObject = {
      day: date.toLocaleDateString("tr-TR", dayNumberOptions),
      dayName: date.toLocaleDateString("tr-TR", dayNameOptions),
      key: "x" + date.toLocaleDateString("tr-TR").replaceAll(".", "_"),
    };
    dayInMonth.days.push(dayObject);
    date.setDate(date.getDate() + 1);
  }
  dayInMonth.month = date.toLocaleDateString("tr-TR", monthOptions);
  return dayInMonth;
}
function getDaysInYear() {
  let days = [];
  for (let i = 0; i < 12; i++) {
    days.push(getDaysInMonth(i, new Date().getFullYear()));
  }
  let lastItem = days[days.length - 1];
  days.pop();
  days.unshift(lastItem);
  return days;
}
function uiHandler(){
    let allDays = JSON.parse(localStorage.getItem("days"));
    let breakChainHtml = "";
    let breakChains = localStorage.getItem("breakchain");
    allDays.forEach(function (item) {
        breakChainHtml += `
              <div class="breakChainWrapper m-5 p-5 border rounded">
              <h1>${item.month}</h1>
              <div class="months">
              `;
        item.days.forEach(function (dayObject) {
          let defaultStyle = "white";
          let colorStyle = "black";
          if (breakChains) {
            let index = breakChains.indexOf(dayObject.key);
            if (index > -1) {
              defaultStyle = "green";
              colorStyle = "white";
            }
          }
          breakChainHtml += `
                  <div class="days" style="background:${defaultStyle};color:${colorStyle}" id="${dayObject.key}"><span>${dayObject.day}</span> <span>${dayObject.dayName}</span></div>
                  `;
        });
        breakChainHtml += `</div></div>`;
      });
      document.getElementById("breakChainContainer").innerHTML = breakChainHtml;
}
function eventListeners() {
  let days = document.querySelectorAll(".days");
  days.forEach(function (item) {
    item.addEventListener("click", function (e) {
      if (e.currentTarget.style.background != "green") {
        e.currentTarget.style.background = "green";
        e.currentTarget.style.color = "white";
        let breakChains = JSON.parse(localStorage.getItem("breakchain"));
        if (!breakChains) {
          breakChains = [];
        }
        breakChains.push(e.currentTarget.id);
        localStorage.setItem("breakchain", JSON.stringify(breakChains));
      } else {
        e.currentTarget.style.background = "white";
        e.currentTarget.style.color = "black";
        let breakChains = JSON.parse(localStorage.getItem("breakchain"));
        let index = breakChains.indexOf(e.currentTarget.id);
        if (index > -1) {
          breakChains.splice(index, 1);
        }
        localStorage.setItem("breakchain", JSON.stringify(breakChains));
      }
    });
  });
}
function Init() {
  let days = localStorage.getItem("days");
  if (!days) {
    localStorage.setItem("days", JSON.stringify(getDaysInYear()));
  }
  uiHandler();
  eventListeners();
}
Init();
