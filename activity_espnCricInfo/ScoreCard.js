let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let path=require("path");
// let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-kings-xi-punjab-2nd-match-1216493/full-scorecard";
function processSingleMatch(url){
    request(url,cb);
}
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
    let searchTool=cheerio.load(html);
    //team name
    let bothInningArr=searchTool(".Collapsible");
    // let scorecard="";
    for(let i=0;i<bothInningArr.length;i++)
    {
        // scorecard+=searchTool(bothInningArr[i]).html();
        let teamNameElem=searchTool(bothInningArr[i]).find("h5");
        let teamName=teamNameElem.text();
        // console.log(teamName);
        teamName=teamName.split("INNINGS")[0];
        console.log(teamName);
        console.log("~~~~~~~~~~~~");
        teamName=teamName.trim();
        let teamPath=path.join("C:\\Users\\rajes\\Desktop\\Web Dev Pep\\Module_2_WebScrapping\\activity_espnCricInfo\\TEAM_FOLDER",teamName);
        if(!fs.existsSync(teamPath))
        fs.mkdirSync(teamPath);
        let batsManTableBodyAllRow=searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        // console.log(batsManTableBodyAllRow.length);
        // type cohersion loops ->
        // let balls=0,runs=0;
        for(let j=0;j< batsManTableBodyAllRow.length;j++){
            let numberOfTds=searchTool(batsManTableBodyAllRow[j]).find("td");
            //console.log(numberOfTds.length);
            if(numberOfTds.length==8){
                let playerName=searchTool(numberOfTds[0]).text().trim();
                let playerPath=path.join(teamPath,playerName+".json");
                let runs=searchTool(numberOfTds[2]).text().trim();
                let balls=searchTool(numberOfTds[3]).text().trim();
                let fours=searchTool(numberOfTds[5]).text().trim();
                let sixes=searchTool(numberOfTds[6]).text().trim();
                let sr=searchTool(numberOfTds[7]).text().trim();
                // let arr=[playerName,runs,balls,fours,sixes,sr];
                let obj={
                    "Player_Name":playerName,
                    "Runs":runs,
                    "Balls":balls,
                    "Fours":fours,
                    "Sixes":sixes,
                    "Strike_Rate":sr
                }
                let arr=[obj];
                let mod=JSON.stringify(arr);
                if(!fs.existsSync(playerPath)){
                // let playerFile=playerName+".json";
                    fs.writeFileSync(playerPath,mod);
                }
                // console.log(playerPath);
                else{
                    let content =fs.readFileSync(playerPath);
                    let jsondata=JSON.parse(content);
                    jsondata.push({"Player_Name":playerName,
                    "Runs":runs,
                    "Balls":balls,
                    "Fours":fours,
                    "Sixes":sixes,
                    "Strike_Rate":sr});
                    let jsonWrite=JSON.stringify(jsondata);
                    fs.writeFileSync(playerPath,jsonWrite);
                }
                // console.log(playerName,"\t\t",runs," \t",balls," \t",fours," \t",sixes," \t",sr);
                console.table(arr);

            }
        }
        
        console.log("``````````````````````````````");
    }
    // fs.writeFileSync("match.html",scorecard);
    // players name
}

module.exports={
    processSingleMatch
}