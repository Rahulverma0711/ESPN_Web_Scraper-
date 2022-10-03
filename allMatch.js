const request=require('request');
const cheerio=require('cheerio');
const scorecardobj=require('./scorecards')

function allMatchLink(fullLink){
    request(fullLink,cb);
function cb(error,response,html){
    if(error){
        console.log("error");
    }else{
        extractAllMatchLInk(html);
    }
}
}
function extractAllMatchLInk(html){
    let $=cheerio.load(html);
    let allLinkArr= $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
    for(let i=0;i<allLinkArr.length;i++){
        let link=$(allLinkArr[i]).attr("href");
        let fullLink="https://www.espncricinfo.com"+link;
        scorecardobj.getInfo(fullLink);
    }
    

}
module.exports={
    allMatchLink:allMatchLink
}