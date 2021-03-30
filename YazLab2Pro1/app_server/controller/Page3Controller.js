var path = require('path');
const util = require('util')
const axios = require('axios');
var fs = require('fs');
const { read } = require('fs');
var LastScore = 0;
var wordFrequency = [];
var allTerms=[];
var wordFreuqency1 = [];
var intersection = 0;
var wordFreuqency2 = [];
var allWordCount1 = 0;
var stopwords = [];
var allWordCount2 = 0;
var ResultFrequency = [];   
var keyword = [];
var Keywords1 = []
var Keywords2 = []
  jsdom = require('jsdom'),
  { JSDOM } = jsdom;

  
module.exports.Score = function (req,res) {
  res.render('page3Score',{Keywords1:[],Keywords2:[],mainurl:"",secondurl:"",LastScore:""})
}
 module.exports.ScorePost = function (req,res) {
     async function printKeywords() {
       mainurl=req.body.mainurl;
       secondurl=req.body.secondurl;
       await Control(req.body.mainurl,req.body.secondurl);
       res.render('page3Score',{Keywords1:Keywords1,Keywords2:Keywords2,mainurl:req.body.mainurl,secondurl:req.body.secondurl,LastScore:LastScore})
     }
    printKeywords();
   
 }

  function CalculateScore(url) {
 
    async function getNodes(html){
   const TextData = [],
     dom = new JSDOM(html),
     news = dom.window.document.querySelectorAll('p');
   news.forEach(item => {
     Text += item.textContent.toLowerCase();
     TextData.push({
       text: item.textContent,
     })
   });
 
   var result = Text.split(/['\t', -.'\n']+/);
   //console.log(result.length)
   if(url==mainurl){
    allWordCount1=result.length;
   }

   else if(url==secondurl){
    allWordCount2=result.length;
   }
  
    wordFrequency = []
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
  
    stopwords = await AddStopWords();
    
  //console.log(stopwords);
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

 if(url==mainurl){
  wordFreuqency1=wordFrequency;
 }

 else if(url==secondurl){
  wordFreuqency2=wordFrequency;
 }

 
   var number =result.length*(2/100);
 var roundedNumber = Math.round(number);
 
 let keyword = [];
 for (let i = 0; i < roundedNumber; i++) {
   keyword[i] = [];
   keyword[i][0]=wordFrequency[i][0];
   keyword[i][1]=wordFrequency[i][1];
 }


 
 //console.log(keyword);
   return keyword;
 }
 let keywords = [] ;
    
  function axiosTest() {
    // create a promise for the axios request
    const promise = axios.get(url)
 
    // using .then, create a new promise which extracts the data
    const dataPromise = promise.then((response) => response.data)
 
    // return it
    
    return dataPromise
 
 }
 
 // now we can use that data from the outside!
 
 var Text = "";
 
 //console.log(keywords)
 
 
 let userToken =axiosTest()
 //console.log(userToken) // Promise { <pending> }
 
 keywords=userToken.then(function(result) {
   // console.log(result) // "Some User token"
    result=getNodes(result);
    return result 
 })
 
 return keywords
 
   }

  async function Control(mainurl,secondurl) {
   Keywords1=await CalculateScore(mainurl);
  
   Keywords2=await CalculateScore(secondurl);
 
   let score=100;
   let allfrequency=0;
 
   for (let j = 0; j < Keywords2.length; j++) {
    allfrequency+=Keywords2[j][1]
   }


  
   for (let i = 0; i < Keywords1.length; i++) {
      for (let j = 0; j < wordFrequency.length; j++) {
          if(Keywords1[i][0]==wordFrequency[j][0]){

           // score+=(Keywords1[i][1]*wordFrequency[j][1]);

          }
        
    }
    
   }

   
  //Cosine Similatiry
   allTerms=[];

  for (let i = 0; i < Keywords1.length; i++) {
    let word=Keywords1[i][0];
    let freq=Keywords1[i][1];
    let newword=[];
    newword[0]=word;
    newword[1]=freq;
    allTerms.push(newword)
  }
  var termexist=0;
  for (let i = 0; i < Keywords2.length; i++) {
    termexist=0;
    for (let j = 0; j < allTerms.length; j++) {
       if(allTerms[j][0]==Keywords2[i][0]){
         termexist=1;
       }
     
    }

    if(!termexist){
      let word=Keywords2[i][0];
      let freq=Keywords2[i][1];
      let newword=[];
      newword[0]=word;
      newword[1]=freq;
    allTerms.push(newword)
    }

  }

  for (let x = 0; x < allTerms.length; x++) {
   allTerms[x][1]=0;
  }
  
 
  //console.log(allTerms)
  //console.log("Keywords dizisi 111:"+Keywords1)
  var vecKeywords1=[];
  var vecKeywords2=[];
  for (let i = 0; i < allTerms.length; i++) {
    let word=allTerms[i][0];
    let freq=allTerms[i][1];
    let newword=[];
    newword[0]=word;
    newword[1]=freq;
   vecKeywords1.push(newword);
  }
  for (let i = 0; i < allTerms.length; i++) {
    let word=allTerms[i][0];
    let freq=allTerms[i][1];
    let newword=[];
    newword[0]=word;
    newword[1]=freq;
    vecKeywords2.push(newword);
  }
 
  for (let i = 0; i < vecKeywords1.length; i++) {
    for (let j = 0; j < Keywords1.length; j++) {
      if(vecKeywords1[i][0]==Keywords1[j][0]){
        vecKeywords1[i][1]=Keywords1[j][1];
      }

    }
    
  }
  
  for (let i = 0; i < vecKeywords2.length; i++) {
    for (let j = 0; j < Keywords2.length; j++) {
      if(vecKeywords2[i][0]==Keywords2[j][0]){
        vecKeywords2[i][1]=Keywords2[j][1];
      }

    }
  }

  //console.log(vecKeywords1);
  //console.log(vecKeywords2);
  
  var dot = 0 ; // 
  
  for (let i = 0; i < vecKeywords1.length; i++) {
    dot+=vecKeywords1[i][1]*vecKeywords2[i][1];
  }
   console.log("noktasal çarpım:"+dot);

//norm
var norm1=0;
   for (let i = 0; i < vecKeywords1.length; i++) {
      norm1+=vecKeywords1[i][1]*vecKeywords1[i][1]
  }
 
  norm1=Math.sqrt(norm1)
  console.log(norm1)
  var norm2=0;
   for (let i = 0; i < vecKeywords2.length; i++) {
    norm2+=vecKeywords2[i][1]*vecKeywords2[i][1]
  }
  norm2=Math.sqrt(norm2)
  console.log(norm2)
  var cosine=0;
  //cos(d1,d2) = dot(d1,d2) / (||d1|| ||d2||) 
  cosine=100*dot/(norm1*norm2);
  console.log("Kosinüs benzerliği:"+100*dot/(norm1*norm2))
  LastScore=cosine;
  if(LastScore>100){
    LastScore=100;
  }
  if(LastScore<0){
    LastScore=0;
  }
  }
 
 