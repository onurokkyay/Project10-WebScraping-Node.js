var path = require('path');

module.exports.index = function (req,res) {
    res.render('page1',{mainurl:'',urlarray: []})
}

module.exports.indexPost = function (req,res) {
    console.log(req.body)
   var count = Object.keys(req.body).length
   var mainurl=req.body.mainurl;
   var urlarray = [];
   for (let i = 1; i < count; i++) {
       urlarray.push(req.body[Object.keys(req.body)[i]])
      //  console.log(Object.keys(req.body)[i])
    //  console.log("Deger"+ req.body[Object.keys(req.body)[i]])
   }
   console.log(urlarray)

   
    res.render('page1',{urlarray:urlarray,mainurl:mainurl})
   

}

