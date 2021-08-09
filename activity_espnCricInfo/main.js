let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let scoreCardObj=require("./ScoreCard");
// input given
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);
function cb(error, response,html) {
    if(error){
        console.log(error); //prints error if occured
        }
    else if(response.statusCode==404){
        console.log("Page Not Found");
    }
    else{
        dataExtractor(html);
    }    
}

function dataExtractor(html){
    // search tool
    let searchTool=cheerio.load(html);
    let anchorRep=searchTool('a[data-hover="View All Results"]');
    let link=anchorRep.attr("href");
    // console.log("link",link);
    // making full match page link
    let FullMatchPageLink=`https://www.espncricinfo.com${link}`;
    // console.log(FullMatchPageLink);
    // go to all match page
    request(FullMatchPageLink,allMatchPageCb);
}

function allMatchPageCb(error, response,html) {
    if(error){
        console.log(error); //prints error if occured
        }
    else if(response.statusCode==404){
        console.log("Page Not Found");
    }
    else{
        // console.log(html);
        getAllScoreCardLink(html);
    }    
}

function getAllScoreCardLink(html){
    console.log("`````````````````````````");
    let searchTool=cheerio.load(html);
    let allScoreCard=searchTool("a[data-hover='Scorecard']");
    for(let i=0;i<allScoreCard.length;i++)
    {
        let link=searchTool(allScoreCard[i]).attr("href");
        let fullAllMatchPageLink=`https://www.espncricinfo.com${link}`;
        // console.log(fullAllMatchPageLink);
        scoreCardObj.processSingleMatch(fullAllMatchPageLink);
    }
}

