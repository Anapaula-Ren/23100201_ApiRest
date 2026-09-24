var soap = require('soap');
var url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl';
var args = {ubiNum:500 };
 
soap.createClient(url, {}, function (err, client) {
  client.NumberToWords(args, function (err, result) {
    console.log(result);
  });
});
 