
var db = require("../helper/db/db_query");
var gplay = require('google-play-scraper');
var async = require("async");

exports.index = {

    insert: function(callback) {

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

        var count = 0;
        var length = Object.keys(gplay.developer).length-1;
        // var length2 = Object.keys(gplay.category).length-1;

        for(var index in FirstdevIdList) {

            gplay.developer({
                // devId: "Google LLC",
                devId: FirstdevIdList[index],
                country: "kr",
                num: 200

            }).then(function(devId){

                console.log("=======devId Length : " + devId.length);
                // console.log("=======category Length : " + length2);


                for(var i=0; i<devId.length; i++) {

                    // 타이머 이벤트에 즉시 실행 함수를 랩핑.
                    (function(i, devId){
                        process.nextTick(function(){

                            var appInfo = devId[i];

                            var info = {
                                title: appInfo.title,
                                appId: appInfo.appId,
                                developer: appInfo.developer,
                                developerId: appInfo.developerId
                        
                            };
                            
                            // console.log("count about devId & info ========= : " + i );
                            

                            var insertCompanyQ = "insert into app_companys(id, name) value('"+info.developerId+"', '"+info.developer+"')";

                            db.insert(insertCompanyQ, function(err, result){

                                if(err) {
                                    // console.log(err);
                                    if(err.errno === 1062) {

                                        var appInfoQ = "insert into app_infos(app_id, app_name, app_companys_id) value('"+info.appId+"', '"+info.title+"', (select app_companys_id from app_companys where name='"+info.developer+"'))";
                                        //원래 없던 부분..
                                        db.insert(appInfoQ, function(err, result){
                                                gplay.permissions({appId: info.appId}).then(function(permi){

                                                    for(var i=0; i<permi.length; i++) {
                                                        (function(i, permi) {
                                                            process.nextTick(function () {



                                                                var permissionQ = "insert into app_permissions(permission, app_infos_id) value('"+permi[i].permission+"',"+result.insertId+")";
                                                                // console.log(permissionQ);//
                                                                db.insert(permissionQ, function(err, result){
                                                                    // console.log(err);
                                                                })

                                                            });
                                                        })(i, permi)
                                                    }

                                                });
                                            

                                        })
                                        console.log("insert is ended at front " + i);

                                    }

                                } 
                                else {
                                    console.log("+++=+++++++++++=============++++++++=");
                                    var appInfoQ = "insert into app_infos(app_id, app_name, app_companys_id) value('"+info.appId+"', '"+info.title+"', "+result.insertId+")";

                                    db.insert(appInfoQ, function(err, result){

                                        gplay.permissions({appId: info.appId}).then(function(permi){

                                            for(var i=0; i<permi.length; i++) {
                                                (function(i, permi) {
                                                    process.nextTick(function () {

                                                        var permissionQ = "insert into app_permissions(permission, app_infos_id) value('"+permi[i].permission+"',"+result.insertId+")";
                                                        // console.log(permissionQ);//
                                                        db.insert(permissionQ, function(err, result){
                                                            // console.log(err);
                                                        })

                                                    });
                                                })(i, permi)
                                            }

                                        });

                                    })

                                }

                                if(length === count) {
                                    callback(null);
                                }

                                ++count;

                            });

                        });
                    })(i, devId);

                }



            });


        }

    }
};
