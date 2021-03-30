var path = require('path');
var fs = require('fs');
const { read } = require('fs');
var ResultFrequency = [];    
var wordFrequency = [];
var Text = "";
const util = require('util')
const axios = require('axios'),

  jsdom = require('jsdom'),
  { JSDOM } = jsdom;
module.exports.Frequency = function (req,res) {
    res.render('page1Frequency',{mainurl:'',wordfrequency: []})
}
module.exports.FrequencyPost = function (req,res) {
    async function printfrequency() {
        await findfrequency(req.body.mainurl);
        res.render('page1Frequency',{mainurl:req.body.mainurl,wordfrequency:ResultFrequency})
    }
    printfrequency()
}
async function findfrequency(url) {
  
  async function AxiosConnect() {
    // create a promise for the axios request
    const promise = axios.get(url)

    // using .then, create a new promise which extracts the data
    const dataPromise = promise.then((response) => response.data)

    // return it

    return dataPromise

  }
  let axiosconnected = AxiosConnect()
  //console.log(userToken) // Promise { <pending> }
   await axiosconnected.then(function (result) {
    // console.log(result) // "Some User token"
     getNodes(result);

  })
async function getNodes(html){
//  console.log(html);
    Text = "";
  const TextData = [],
    dom = new JSDOM(html),
    
    news = dom.window.document.querySelectorAll('p');
  news.forEach(item => {
    Text += item.textContent.toLowerCase();
    TextData.push({
      text: item.textContent,
    })
  });


 // console.log(Text);

  var result = Text.split(/['\t', -.'\n']+/);
  //console.log(util.inspect(result, { maxArrayLength: null }))
  for (var i = 0; i < result.length; i++) {
    wordFrequency[i] = [];
    for (var j = 0; j < 2; j++) {
      wordFrequency[i][j] = undefined;
    }
  }

  wordFrequency[0][0]=result[0];
  wordFrequency[0][1]=1;
 
  async function AddStopWords(){
    try {
      var data = fs.readFileSync('stop_words_turkish.txt', 'utf8');
        
      return data.split(/[''\n\r']+/);
    } catch(e) {
      console.log('Error:', e.stack);
      return null;
    }
  }    
  
  var stopwords = await AddStopWords();
 // console.log(stopwords.length);

  for (let i = 1; i < result.length; i++) {
    var isexist= -1 ;
    for (let j = 0; j < wordFrequency.length; j++) {
       if(result[i] == wordFrequency[j][0]){
      
            wordFrequency[j][1]++;
            isexist=j;
            break;
       }
    }


    if(isexist== -1) {
      if(!stopwords.includes(result[i])){
        for(let j = 0; j < wordFrequency.length; j++){
          if(wordFrequency[j][0]==undefined){
            wordFrequency[j][0]=result[i];
            wordFrequency[j][1]=1;
            break;
          }
        }
      }
    
    }
  }

for (let j = 0; j < wordFrequency.length-1; j++) {
  for (let i = 0; i < wordFrequency.length-i; i++) {    
    if(wordFrequency[i][1]<wordFrequency[i+1][1]){
      let temp = wordFrequency[i+1];
      wordFrequency[i+1]= wordFrequency[i];
      wordFrequency[i] = temp;
    }
} 
}

  for (let index = 0; index < wordFrequency.length; index++) {
    //console.log(wordFrequency[index][0],wordFrequency[index][1])
    if(wordFrequency[index][1]!=undefined){
        ResultFrequency[index]=wordFrequency[index];
      
    }
}

}
//console.log(ResultFrequency)
  }

