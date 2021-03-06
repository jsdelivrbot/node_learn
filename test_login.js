var login = require('./login');
var addToCart = require("./add_to_cart");
var lookup = require("./lookup");
var purchase = require("./purchase");
var fbNotification = require("./fbNotification");


function purchaseCallBack(parameter){
	if(parameter.state == "success"){
		console.log("purchaseCallBack: "+JSON.stringify(parameter));

		var headers = {};
		headers.Authorization = parameter.Authorization;

		fbNotification.fbNotification(headers,parameter.data,fbNotificationCallBack);

	}else{
		console.log("purchaseCallBack: something happened cannot continue"+parameter);
	}
};


function lookupCallBack(parameter){
	if(parameter.state == "success"){
		console.log("lookupCallBack: "+parameter);
		var headers = {};
		headers.Authorization = parameter.Authorization;
		addToCart.addItem(headers,{},lookupCallBack);
	}else{
		console.log("lookupCallBack: something happened cannot continue"+parameter);

	}
};

function fbNotificationCallBack(parameter){
	if(parameter.state == "success"){
		console.log("fbNotificationCallBack: "+JSON.stringify(parameter));

		parameter.data();

	}else{
		console.log("fbNotificationCallBack: something happened cannot continue"+parameter);

	}
};



function addToCartCallBack(parameter){
	if(parameter.state == "success"){
		console.log("addToCartCallBack: "+JSON.stringify(parameter));


		var headers = {};
		headers.Authorization = parameter.Authorization;
		headers.url = parameter._url;
		purchase.purchase(headers,parameter.data,purchaseCallBack);

	}else{
		console.log("addToCartCallBack: something happened cannot continue"+JSON.stringify(parameter));

	}
};

function loginCallBack(parameter){
	console.log("loginCallBack "+JSON.stringify(parameter));

	if(parameter.state == "success")
	{
		console.log("loginCallBack: "+JSON.stringify(parameter.body));
		var headers = {};
		headers.Authorization = parameter.Authorization;
		addToCart.addItem(headers,parameter.data,addToCartCallBack);
	}else{
		console.log("something happened cannot continue");
	}
};

//login.login({},{},loginCallBack);


module.exports = {
	performCheckout: function(headers,data,callback_){
		data.callback = callback_;
		login.login({},data,loginCallBack);
	}
};

