var express = require('express');
var router = express.Router();
var MainPageController = require('../controller/MainPageController')
router.get('/Mainpage', MainPageController.index);
router.post('/Mainpage', MainPageController.indexPost);
var Page1Controller = require('../controller/Page1Controller')
router.get('/Frequency', Page1Controller.Frequency);
router.post('/Frequency', Page1Controller.FrequencyPost);
var Page2Controller = require('../controller/Page2Controller')
router.get('/Keywords', Page2Controller.Keywords);
router.post('/Keywords', Page2Controller.KeywordsPost);
var Page3Controller = require('../controller/Page3Controller')
router.get('/Score', Page3Controller.Score);
router.post('/Score', Page3Controller.ScorePost);
var Page4Controller = require('../controller/Page4Controller')
router.get('/MultipleURL', Page4Controller.MultipleURL);
router.post('/MultipleURL', Page4Controller.MultipleURLPost);
var Page5Controller = require('../controller/Page5Controller')
router.get('/Semantik', Page5Controller.Semantik);
router.post('/Semantik', Page5Controller.SemantikPost);


module.exports = router;