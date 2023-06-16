const http = require("http");
const fs = require("fs");
var requests = require("requests");
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%temp_minval%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%temp_maxval%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
 
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
const homeFile = fs.readFileSync("index.html", "utf-8");
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Alwar&appid=d109354bfaf43ed4f7323522cc3ce35b&units=metric"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk)
        const arrdata = [objdata]
        // console.log(arrdata);
        const realTimeData = arrdata
        .map((val) => replaceVal(homeFile, val))
        .join("");
        res.write(realTimeData);
       
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
       res.end();
        // console.log("end");
      });
  }
});
server.listen(3000, "127.0.0.1")
