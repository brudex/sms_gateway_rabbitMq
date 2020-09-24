
exports.generateNewID= function(userType,usercount,callback){
    var id=newRandomId(userType,usercount);
    callback(null,id);
};

exports.generateTransId = function(callback){
    var id=generateTransId();
    callback(id);
};

exports.generateTransIdSync = function(){
    return generateTransId();
};


function generateTransId(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var date = new Date();
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var year = date.getFullYear().toString().substr(2,2);
    var customDate =""+ month + day + year ;
    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text+customDate;
}

exports.encryptPassword = function(password,callback){
    bcrypt.hash(password, null, null, function(err, hash) {
        callback(hash)
    });
};

exports.comparePassword = function(password,hash,callback){
    bcrypt.compare(password, hash, function(err, res) {
        callback(res);
    });
};




exports.generateRandomPass = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*&^%$#@!)(abcdefghijklmnopqursuvwxyz";
    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

exports.generateSecretCode = function(){
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

exports.isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};



exports.formatDate =function(date){
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return monthNames[monthIndex] + " "+ day + ", "+ year;

};

exports.formatMobile = function(mobile){
    console.log("Mobile To format >>>"+mobile);
    if(mobile!= null){
        mobile= mobile.trim();
        if(mobile.indexOf("0") == 0) {
            return mobile;
        } else  {
            if(mobile.indexOf("233") == 0) {
                mobile = "0"+mobile.substr(3);
            } else if(mobile.indexOf("+") == 0) {
                mobile ="0"+ mobile.substring(4);
            }else{
                return "0"+mobile;
            }
            return mobile;
        }
    }

    return "";

};


exports.getISODate = function (dt) {
    if(typeof dt == 'string'){
        if(/\d{4}-[01]\d-[0-3]\d/g.test(dt)){
            return dt
        }
    }
    var date = {year: "2015", month: "08", day: "9"};
    if(dt.getFullYear){
        date.year = "" + dt.getFullYear();
        date.month = "" + dt.getMonth();
        date.day = "" + dt.getDay();
    }else if(!isNaN(dt)){
        var str = ""+dt;
        if (str.length == 8) {
            date.year = str.substr(0, 4);
            var mn = parseInt(str.substring(4, 6)) - 1;
            if(mn< 10){
                date.month = "0"+mn;
            }else{
                date.month = ""+mn;
            }

            date.day = str.substring(6);
        }
    }
    return date.year + "-"+date.month + "-"+date.day;
};

exports.getDbDateFormat =function(dt) {
    if(typeof dt == 'string'){
        if(/\d{4}-[01]\d-[0-3]\d/g.test(dt)){
            return dt
        }
    }
    var date = {year: "2015", month: "08", day: "9"};
    if (typeof dt !== 'string') {

        date.year = "" + dt.getFullYear();
        date.month = "" + (dt.getMonth() + 1);
        date.day = "" + dt.getDay();
        return date.year + "-"+date.month + "-"+date.day;
    }
    date.year = dt.substr(0, 4);
    date.month = dt.substring(4, 6);
    date.day = dt.substring(6);
    return date.year + "-"+date.month + "-"+date.day;
};

exports.validDates =function(dt) {

    if(/\d{4}-[01]\d-[0-3]\d/g.test(dt)){
        return true
    }else if(/\d{4}[01]\d[0-3]\d/g.test(dt)){
        return true;
    }
    return false

};

