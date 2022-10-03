const request=require('request');
const cheerio=require('cheerio');
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
function processUrl(url){
    request(url,cb);
}


function cb(error,response,html){
    if(error){
        console.log("error");
    }else{
        extract(html);
    }
}
function extract(html){
    let $=cheerio.load(html);
    let matchDetailArr=$(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let matchDetail=$(matchDetailArr[0]).text().split(",");
    let result=$(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title").text();
    let venue=matchDetail[1];
    let date=matchDetail[2];
    


    //innings
    let teamsArr=$(".ds-rounded-lg.ds-mt-2");
    for(let i=0;i<teamsArr.length;i++){
        let team=$(teamsArr[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        let opponentIndex=i==0?1:0;
        let opponent=$(teamsArr[opponentIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        
        console.log(`${team} ${opponent} ${date} ${venue} ${result}`);
        let cinnings=$(teamsArr[i]);
        let allRows=cinnings.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr");
        for(let j=0;j<allRows.length;j++){
           let allcol=$(allRows[j]).find("td");
           let isworthy=$(allcol[0]).hasClass("ds-w-0 ds-whitespace-nowrap ds-min-w-max");
           if(isworthy==true){
             let playerName= $(allcol[0]).find("a");
             let player=$(playerName[0]).find("span");
             let name=$(player[0]).text().trim();
             let runs=$(allcol[2]).text().trim();
             let balls=$(allcol[3]).text().trim();
             let fours=$(allcol[5]).text().trim();
             let sixes=$(allcol[6]).text().trim();
             let strikeRate=$(allcol[7]).text().trim();
             console.log(`${name} ${runs} ${balls} ${fours} ${sixes} ${strikeRate} `);
             processInformation(
                date,
                venue,
                result,
                team,
                opponent,
                name,
                runs,
                balls,
                fours,
                sixes,
                strikeRate
            );
           }
        }
        console.log("-----------------------------------------------------------------");
    }
    
   
}
function processInformation(dateOfMatch, venueOfMatch, matchResult, ownTeam, opponentTeam, playerName, runs, balls, numberOf4, numberOf6, sr) {
    let teamNamePath = path.join(__dirname, "IPL", ownTeam);
    if (!fs.existsSync(teamNamePath)) {
        fs.mkdirSync(teamNamePath);
    }

    let playerPath = path.join(teamNamePath, playerName + ".xlsx");
    let content = excelReader(playerPath, playerName);

    let playerObj = {
        dateOfMatch,
        venueOfMatch,
        matchResult,
        ownTeam,
        opponentTeam,
        playerName,
        runs,
        balls,
        numberOf4,
        numberOf6,
        sr
    };

    content.push(playerObj);

    excelWriter(playerPath, content, playerName);

}



//this function reads the data from excel file
function excelReader(playerPath, sheetName) {
if (!fs.existsSync(playerPath)) {

    return [];
}

let workBook = xlsx.readFile(playerPath);

let excelData = workBook.Sheets[sheetName];
let playerObj = xlsx.utils.sheet_to_json(excelData);
return playerObj;
}

function excelWriter(playerPath, jsObject, sheetName) {

let newWorkBook = xlsx.utils.book_new();
let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
xlsx.writeFile(newWorkBook, playerPath);
}
module.exports={
    getInfo:processUrl
}