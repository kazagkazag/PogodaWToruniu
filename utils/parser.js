import cheerio from "cheerio";

function getTableDOM(htmlText) {
  const $ = cheerio.load(htmlText);
  return $(".views-table");
}

function getActualTempDOM(htmlText) {
  const $ = cheerio.load(htmlText);
  return $("#aktualnie");
}

function getWeatherFromWeekTable(tableDOM){
  const daysDOM = tableDOM.find("tr");
  return getWeatherForDays(daysDOM)
}

function getActualTempFromHTML(tableDOM) {
  const actualTempCell = tableDOM.find(".Temp");
  return actualTempCell.text().replace(/\s/g, "").match(/^-?\d+\.?\d+/g);
}

function getWeatherForDays(daysDOM) {
  const daysWeather = [];

  daysDOM.each((index, day) => {
    daysWeather.push(getWeatherForDay(day));
  });

  return daysWeather.filter(day => !!day);
}

function getWeatherForDay(day) {
  const cells = cheerio(day).find("td");

  if(!cells.length) {
    return;
  }

  const date = cheerio(cells[0]).text().replace(/\s/g, "");

  const data = {
    dayName: date.match(/[^\d]*/)[0],
    date: date.match(/\d{2}\.\d{2}/g)[0],
    icon: cheerio(cells[1]).html().replace(/\s/g, "").match(/[a-z]*\.jpg/g)[0],
    tempMin: cheerio(cells[2]).text().replace(/\s/g, ""),
    tempMax: cheerio(cells[3]).text().replace(/\s/g, "")
  };

  return data;
}

export function getActualTemp(htmlText) {
  return getActualTempFromHTML(getActualTempDOM(htmlText));
}

export function getWeatherForWeek(htmlText) {
  return getWeatherFromWeekTable(getTableDOM(htmlText));
}
