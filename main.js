const request=require('request');
const cheerio=require('cheerio');
const allmatchobj=require('./allMatch');
const fs = require("fs");
const path = require("path");

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595",cb);
function cb(error,response,html){
    if(error){
        console.log("error");
    }else{
        handleHtml(html);
    }
}
let iplPath = path.join(__dirname,"IPL");
if (!fs.existsSync(iplPath)) {
  fs.mkdirSync(iplPath);
}

function handleHtml(html){
    let $=cheerio.load(html);
    let linkArr=$(".ds-border-t.ds-border-line.ds-text-center.ds-py-2>a");
    let link=$(linkArr[0]).attr("href");
    let fullLink="https://www.espncricinfo.com"+link;
    allmatchobj.allMatchLink(fullLink);
  
}