var express = require('express');
var router = express.Router();
var gplay = require('google-play-scraper');
var indexModel = require("../model/index").index;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/crow", function(req, res){

    indexModel.insert(function(err){

        if(err) {
            res.json("ERRIR");
            return;
        }

        res.json("TRUE");

    });


});

router.get("/gp", function(req, res){

    var categoryList = null;

    gplay.categories().then(function(categoryList){

       this.categoryList = categoryList;
        res.json(categoryList);

    });

});


router.get("/list", function(req, res){

    for(var index in gplay.category) {
        console.log(gplay.category[index])
    }

    gplay.list({
        category: gplay.category.GAME_ACTION,
        collection: gplay.collection.TOP_FREE,
        country: 'kr',
        num: 20
    }).then(function(collection){
      res.json(collection);
    });

});

router.get("/devIdListTest", function(req,res){
    var FirstdevIdList = 
    ['Kakao Corporation', 
    'NAVER Corp.',
    'Facebook',
    'Google LLC',
    'Alibaba Mobile',
    'eBay Mobile',
    'ELECTRONIC ARTS',
    'Samsung Electronics Co.,  Ltd.',
    'Microsoft Corporation'];

    var Testresult = "hi";

    for(var index in FirstdevIdList){
        console.log(FirstdevIdList[index]+"\n");
    }

    for(var index in FirstdevIdList){
        gplay.developer({
            // devId: "\""+devIdList+"\"",
            devId: FirstdevIdList[index],
            // devId: "Facebook",
            country: "kr",
            num: 250
        }).then(function(devIdList){
            this.devIdList = devIdList;

            for(var i = 0; i <= devIdList.length; i++){

                var devInfo = devIdList[i];

                var infos = {

                    title: devInfo.title,
                    developer: devInfo.developer
                };

                Testresult = infos;
                console.log(infos);
            }

            res.json(Testresult);    
        });

    }
});



router.get("/developerFacebook", function(req,res){
    var dev = null;

    gplay.developer({
        // devId: "Kakao Corporation",
        // devId: "NAVER Corp.",
        devId: "Facebook",
        // devId: "Microsoft Corporation",
        // devId: "Instagram",
        // devId: "WhatsApp Inc.",
        // devId: "Skype",
        // devId: "LinkedIn",
        country: "kr",
        // lang: "kr",
        num: 150
    }).then(function(dev){
        this.dev = dev;
        // res.json(dev);


    var result = null;
    var result2 = "";
    var result3;
    var countNum = 0;
    var length = Object.keys(gplay.developer).length-1;
    console.log("=====lenght : "+dev.length);
    for(var i = 0; i < dev.length; i++){


        var devInfo = dev[i];

        var info = {
            title: devInfo.title,
            appId: devInfo.appId,
            developer: devInfo.developer,
            developerId: devInfo.developerId

        };

        result = info;
        console.log(result);
        result2 += JSON.stringify(result);
        // console.log(result2);
        countNum++;

        
    }
    console.log("=====num : "+countNum);
    // result3 = JSON.parse(result2);
    res.send(result);
    // res.json(result3);

        

    });
});


router.get("/searchGoogle", function(req,res){
    var search = null;

    gplay.search({
        term: "Google",
        num: 100
    }).then(function(search){
        this.search = search;
        res.json(search);
    });
});

router.get("/searchSamsung", function(req,res){
    var search = null;

    gplay.search({
        term: "Samsung",
        num: 200
    }).then(function(search){
        this.search = search;
        res.json(search);
    });
});

router.get("/searchNaver", function(req,res){
    var search = null;

    gplay.search({
        term: "NAVER",
        num: 100
    }).then(function(search){
        this.search = search;
        res.json(search);
    });
});

router.get("/searchFacebook", function(req,res){
    var search = null;

    gplay.search({
        // term: "Facebook",
        term: "Instagram",
        num: 100
    }).then(function(search){
        this.search = search;
        res.json(search);
    });
});

router.get("/searchKakao", function(req,res){
    var search = null;

    gplay.search({
        term: "Kakao",
        num: 250
    }).then(function(search){
        this.search = search;
        // res.json(search);

        for(var i = 0; i<search.length; i++){

            var searchInfo = search[i];

            var info = {
                title: searchInfo.title,
                // appId: searchInfo.appId,
                developer: searchInfo.developer,
                // developerId: searchInfo.developerId
            };
            console.log(info);

        }

    });
});



router.get("/suggest", function(req,res){

    gplay.suggest({
        term: "NAVER",
        country: 'ko',
    }).then(console.log);
});


router.get("/similar", function(req,res){

    gplay.similar({
        appId: "com.google.android.youtube"
    }).then(console.log);
});


router.get("/permission", function(req, res){

    gplay.permissions({appId: "com.facebook.orca"}).then(function(info){
        // console.log(info);
        res.json(info, null, 2);
    });

    

});

module.exports = router;
