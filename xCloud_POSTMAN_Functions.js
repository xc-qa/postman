////////////////////////////////////////////////////////////
// COMMON POSTMAN FUNCTIONS
////////////////////////////////////////////////////////////
var setRegSvcNameAndKey = "function setRegSvcNameAndKey(svcName,regPairArray,svcNameEnvName=\"serviceName\",svcRegKeyEnvName=\"serviceRegKey\"){var foundSecretPair=false;regPairArray.forEach(function(svc){if(svc.name===svcName){postman.setEnvironmentVariable(svcNameEnvName,svc.name);postman.setEnvironmentVariable(svcRegKeyEnvName,svc.serviceRegKey);foundSecretPair=true;}});if(!(foundSecretPair)){postman.setEnvironmentVariable(svcNameEnvName,\"Not Found\");postman.setEnvironmentVariable(svcRegKeyEnvName,\"Not Found\");}}";
postman.setGlobalVariable("module:setRegSvcNameAndKey", setRegSvcNameAndKey);

var getSvcIdFromRespBody = "function getSvcIdFromRespBody(jsonData,serviceName){var match;if(!(Array.isArray(jsonData))){if(jsonData.name===serviceName){match=jsonData.serviceId;}} else{jsonData.forEach(function(svc){if(svc.name===serviceName){match=svc.serviceId;}});} if(match){return match;} else{return undefined;}}";
postman.setGlobalVariable("module:getSvcIdFromRespBody", getSvcIdFromRespBody);

var subsetOfSvcFromArrayFoundInBody = "function subsetOfSvcFromArrayFoundInBody(jsonData,subSvcArray,property=\"serviceId\",testFound=true,totSvcArray=[]){if(responseCode.code===200){var foundSvcs=[];jsonData.forEach(function(svc){foundSvcs.push(svc[property]);});subSvcArray.forEach(function(svcItem){if(testFound){tests[svcItem+\" is found in the GET response body\"]=foundSvcs.indexOf(svcItem)>-1;} else{tests[svcItem+\" is not found in the GET response body\"]=foundSvcs.indexOf(svcItem)===-1;} var indexInTotArray=totSvcArray.indexOf(svcItem);if(indexInTotArray>-1&&totSvcArray.length>0){totSvcArray.slice(indexInTotArray,1);}});if(totSvcArray.length>0){var unexpectedSvcs=0;totSvcArray.forEach(function(svcItem){if(foundSvcs.indexOf(svcItem)>-1){unexpectedSvcs++;}});tests[\"No unexpected services found in response. [\"+unexpectedSvcs+\" found]\"]=unexpectedSvcs===0;}} else{tests[\"Response status code was 200\"]=false;}}";
postman.setGlobalVariable("module:subsetOfSvcFromArrayFoundInBody", subsetOfSvcFromArrayFoundInBody);

/**
 * Function Name: getOGCIdFromRespBody
 * @param {string} jsonData : JSON-parsed response body
 * @param {string} sensusId : The CDM entity Sensus name (e.g. thing@customerId)
 * @returns {string} The serviceId that matches in jsonData to the sensusId. If no match is found then the undefined type is returned
 */
var getOGCIdFromRespBody = "function getOGCIdFromRespBody(jsonData,sensusId){var match;if(!(jsonData.hasOwnProperty(\"value\"))){if(jsonData.sensusID===sensusId){match=jsonData[\"@iot.id\"];}}else{jsonData.value.forEach(function(entity){if(entity.sensusID===sensusId){match=entity[\"@iot.id\"];}});} if(match){return match;}else{return undefined;}}";
postman.setGlobalVariable("module:getOGCIdFromRespBody", getOGCIdFromRespBody);

/**
 * This function runs in a POSTMAN sandbox and takes the postmanStr and returns the string
 * with any POSTMAN environment or global variables that were included now translated.
 * @param {string} postmanStr Any string
 * @returns {string} The postmanStr with any POSTMAN environment/global variables translated
 */
var resolveEnvVars = "function resolveEnvVars(postmanStr){reg=new RegExp(\"{{(.+?)}}\",\"g\");var result;while((result=reg.exec(postmanStr))!==null){var match=result[0];var envVar=result[1];var evaluatedVar=postman.getEnvironmentVariable(envVar);postmanStr=postmanStr.replace(match,evaluatedVar);reg.lastIndex=0;} if(postmanStr===undefined||postmanStr===null){postmanStr=\"\";} return postmanStr;}";
postman.setGlobalVariable("module:resolveEnvVars", resolveEnvVars);

/**
 * Function Name: setAuthHeaders
 * @param {integer} [msOffset=0] How many milliseconds to offset the time from the current time
 * @param {integer} [multiplier=0] Multiple this amount to the msOffset to offset the time from the current time
 */
var authScript = "function resolveEnvVars(postmanStr){reg=new RegExp(\"{{(.+?)}}\",\"g\");var result;while((result=reg.exec(postmanStr))!==null){var match=result[0];var envVar=result[1];var evaluatedVar=postman.getEnvironmentVariable(envVar);postmanStr=postmanStr.replace(match,evaluatedVar);reg.lastIndex=0;} if(postmanStr===undefined||postmanStr===null){postmanStr=\"\";} return postmanStr;} function setAuthHeaders(){postman.clearEnvironmentVariable(\"authHeader\");var requestTime=new Date().toISOString();postman.setEnvironmentVariable(\"requestTime\",requestTime);postman.setEnvironmentVariable(\"dateHeader\",requestTime.split('.')[0]+\"Z\");var authHeader=\"xCloud \";authHeader+=btoa(postman.getEnvironmentVariable(\"authSrvcId\"))+\":\";var requestUrl=resolveEnvVars(request.url);var baseRequestPath=postman.getEnvironmentVariable(\"baseRequestPath\");var requestPath=requestUrl.substr(requestUrl.indexOf(baseRequestPath));var contentTypeHeader=\"application/json\";var xcHeaders=\"\";if(request.data.length>0){var contentMDHeader=CryptoJS.MD5(resolveEnvVars(request.data)).toString(CryptoJS.enc.Base64);}else{var contentMDHeader=\"\";} var Message=[request.method,contentTypeHeader,postman.getEnvironmentVariable(\"dateHeader\"),requestPath,xcHeaders,contentMDHeader,postman.getEnvironmentVariable(\"authSrvcId\")].join('\\n');var Key=postman.getEnvironmentVariable(\"hmacKey\");authHeader+=CryptoJS.HmacSHA256(Message,CryptoJS.enc.Base64.parse(Key)).toString(CryptoJS.enc.Base64);postman.setEnvironmentVariable(\"authHeader\",authHeader);postman.setEnvironmentVariable(\"contentMDHeader\",contentMDHeader);}";
postman.setGlobalVariable("module:authScript", authScript);

////////////////////////////////////////////////////////////
// JSON SCHEMAS TO USE WITH XCLOUD API TESTING
////////////////////////////////////////////////////////////
var wsiProps = {
	"temp": ["minTemp", "maxTemp", "avgTemp"],
	"precip": ["minPrecip", "maxPrecip", "avgPrecip", "totalPrecip"],
	"cloudCoverage": ["minCldCovPct", "maxCldCovPct", "avgCldCovPct"],
	"relativeHumidity": ["minRelHumPct", "maxRelHumPct", "avgRelHumPct"]
};
postman.setEnvironmentVariable("wsiProps", JSON.stringify(wsiProps));

var weatherResp = '{"$schema":"http://json-schema.org/draft-04/schema#","definitions":{},"id":"http://example.com/example.json","properties":{"dataMessages":{"id":"/properties/dataMessages","items":{"id":"/properties/dataMessages/items","properties":{"connection":{"id":"/properties/dataMessages/items/properties/connection","type":"null"},"customerID":{"id":"/properties/dataMessages/items/properties/customerID","type":"string","pattern":"WEATHER_CUST_ID"},"dataType":{"id":"/properties/dataMessages/items/properties/dataType","type":"string","pattern":"WEATHER"},"deviceID":{"id":"/properties/dataMessages/items/properties/deviceID","type":"string","pattern":"WEATHER_DEVICE_ID"},"deviceType":{"id":"/properties/dataMessages/items/properties/deviceType","type":"string","pattern":"WEATHER_DEVICE_TYPE"},"messageID":{"id":"/properties/dataMessages/items/properties/messageID","type":"null"},"payload":{"id":"/properties/dataMessages/items/properties/payload","properties":{"datastream":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream","properties":{"description":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/description","type":"null"},"iotId":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/iotId","type":"null"},"iotSelfLink":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/iotSelfLink","type":"null"},"name":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/name","type":"null"},"observationType":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observationType","type":"null"},"observations":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observations","items":{},"type":"array"},"observedArea":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedArea","type":"null"},"observedProperty":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty","properties":{"definition":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty/properties/definition","type":"null"},"description":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty/properties/description","type":"null"},"iotId":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty/properties/iotId","type":"null"},"iotSelfLink":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty/properties/iotSelfLink","type":"null"},"name":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/observedProperty/properties/name","type":"string"}},"type":"object"},"phenomenonTime":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/phenomenonTime","type":"null"},"resultTime":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/resultTime","type":"null"},"sensor":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/sensor","type":"null"},"thing":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing","properties":{"customerId":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/customerId","type":"string"},"datastreams":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/datastreams","items":{},"type":"array"},"description":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/description","type":"null"},"historicalLocations":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/historicalLocations","items":{},"type":"array"},"iotId":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/iotId","type":"null"},"iotSelfLink":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/iotSelfLink","type":"null"},"locations":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations","items":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items","properties":{"description":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/description","type":"null"},"encodingType":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/encodingType","type":"string"},"iotId":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/iotId","type":"null"},"iotSelfLink":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/iotSelfLink","type":"null"},"location":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/location","type":"string"},"name":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/locations/items/properties/name","type":"null"}},"type":"object"},"type":"array"},"name":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/name","type":"string"},"properties":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/thing/properties/properties","type":"null"}},"type":"object"},"unitOfMeasurement":{"id":"/properties/dataMessages/items/properties/payload/properties/datastream/properties/unitOfMeasurement","properties":{},"type":"object"}},"type":"object"},"featureOfInterest":{"id":"/properties/dataMessages/items/properties/payload/properties/featureOfInterest","type":"null"},"iotId":{"id":"/properties/dataMessages/items/properties/payload/properties/iotId","type":"null"},"iotSelfLink":{"id":"/properties/dataMessages/items/properties/payload/properties/iotSelfLink","type":"null"},"parameters":{"id":"/properties/dataMessages/items/properties/payload/properties/parameters","properties":{},"type":"object"},"phenomenonTime":{"id":"/properties/dataMessages/items/properties/payload/properties/phenomenonTime","type":"null"},"result":{"id":"/properties/dataMessages/items/properties/payload/properties/result","type":"number","minimum":-50,"maximum":100},"resultQuality":{"id":"/properties/dataMessages/items/properties/payload/properties/resultQuality","type":"null"},"resultTime":{"id":"/properties/dataMessages/items/properties/payload/properties/resultTime","type":"string","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\\\.[0-9]{3}Z"},"validTime":{"id":"/properties/dataMessages/items/properties/payload/properties/validTime","type":"null"}},"type":"object"},"transportType":{"id":"/properties/dataMessages/items/properties/transportType","type":"string","pattern":"WEATHER_TRANSPORT_TYPE"}},"type":"object"},"type":"array"},"infoMessage":{"id":"/properties/infoMessage","type":"string"},"requestId":{"id":"/properties/requestId","type":"string"},"subscriberId":{"id":"/properties/subscriberId","type":"string"}},"type":"object"}';
postman.setGlobalVariable("schema:weatherResp", weatherResp);

var things = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Array of Things\",\"properties\":{\"@iot.count\":{\"id\":\"/properties/@iot.count\",\"type\":\"integer\"},\"value\":{\"id\":\"/properties/value\",\"items\":{\"id\":\"/properties/value/items\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/value/items/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/value/items/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"description\":{\"id\":\"/properties/value/items/properties/description\",\"type\":\"string\"},\"name\":{\"id\":\"/properties/value/items/properties/name\",\"type\":\"string\"},\"properties\":{\"id\":\"/properties/value/items/properties/properties\",\"type\":\"object\"},\"Datastreams@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Datastreams@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"HistoricalLocations@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/HistoricalLocations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Locations@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Locations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"customerId\":{\"id\":\"/properties/value/items/properties/customerId\",\"type\":\"string\"},\"sensusID\":{\"id\":\"/properties/value/items/properties/sensusID\",\"type\":\"string\"}},\"type\":\"object\"},\"required\":[\"@iot.id\",\"@iot.selfLink\",\"name\",\"properties\",\"Datastreams@iot.navigationLink\",\"HistoricalLocations@iot.navigationLink\",\"Locations@iot.navigationLink\",\"sensusID\",\"customerId\"],\"type\":\"array\"}},\"required\":[\"@iot.count\",\"value\"],\"type\":\"object\"}";
postman.setGlobalVariable("schema:things", things);

var thing = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Specific Thing\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"description\":{\"id\":\"/properties/description\",\"type\":\"string\"},\"name\":{\"id\":\"/properties/name\",\"type\":\"string\"},\"properties\":{\"id\":\"/properties/properties\",\"type\":\"object\"},\"Datastreams@iot.navigationLink\":{\"id\":\"/properties/Datastreams@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"HistoricalLocations@iot.navigationLink\":{\"id\":\"/properties/HistoricalLocations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Locations@iot.navigationLink\":{\"id\":\"/properties/Locations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"customerId\":{\"id\":\"/properties/customerId\",\"type\":\"string\"},\"sensusID\":{\"id\":\"/properties/sensusID\",\"type\":\"string\"}},\"required\":[\"@iot.id\",\"@iot.selfLink\",\"name\",\"properties\",\"Datastreams@iot.navigationLink\",\"HistoricalLocations@iot.navigationLink\",\"Locations@iot.navigationLink\",\"sensusID\",\"customerId\"],\"type\":\"object\"}";
postman.setGlobalVariable("schema:thing", thing);

var datastreams = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Array of Datastreams\",\"properties\":{\"@iot.count\":{\"id\":\"/properties/@iot.count\",\"type\":\"integer\",\"pattern\":\"^[0-9]+$\"},\"value\":{\"id\":\"/properties/value\",\"items\":{\"id\":\"/properties/value/items\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/value/items/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/value/items/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"description\":{\"id\":\"/properties/value/items/properties/description\",\"type\":\"string\"},\"name\":{\"id\":\"/properties/value/items/properties/name\",\"type\":\"string\"},\"observationType\":{\"id\":\"/properties/value/items/properties/observationType\",\"type\":\"string\"},\"Observations@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Observations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"ObservedProperty@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/ObservedProperty@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Sensor@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Sensor@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Thing@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Thing@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"sensusID\":{\"id\":\"/properties/value/items/properties/sensusID\",\"type\":\"string\"}},\"type\":\"object\",\"required\":[\"@iot.id\",\"@iot.selfLink\",\"Observations@iot.navigationLink\",\"ObservedProperty@iot.navigationLink\",\"Sensor@iot.navigationLink\",\"Thing@iot.navigationLink\",\"sensusID\"]},\"type\":\"array\"},\"required\":[\"@iot.count\",\"value\"]},\"type\":\"object\"}";
postman.setGlobalVariable("schema:datastreams", datastreams);

var datastream = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Specific Datastream\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"description\":{\"id\":\"/properties/description\",\"type\":\"string\"},\"name\":{\"id\":\"/properties/name\",\"type\":\"string\"},\"observationType\":{\"id\":\"/properties/observationType\",\"type\":\"string\"},\"Observations@iot.navigationLink\":{\"id\":\"/properties/Observations@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"ObservedProperty@iot.navigationLink\":{\"id\":\"/properties/ObservedProperty@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Sensor@iot.navigationLink\":{\"id\":\"/properties/Sensor@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"Thing@iot.navigationLink\":{\"id\":\"/properties/Thing@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"sensusID\":{\"id\":\"/properties/sensusID\",\"type\":\"string\"}},\"required\":[\"@iot.id\",\"@iot.selfLink\",\"Observations@iot.navigationLink\",\"ObservedProperty@iot.navigationLink\",\"Sensor@iot.navigationLink\",\"Thing@iot.navigationLink\",\"sensusID\"],\"type\":\"object\"}";
postman.setGlobalVariable("schema:datastream", datastream);

var observations = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Array of Observations\",\"properties\":{\"@iot.count\":{\"id\":\"/properties/@iot.count\",\"type\":\"integer\"},\"value\":{\"id\":\"/properties/value\",\"items\":{\"id\":\"/properties/value/items\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/value/items/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/value/items/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"phenomenonTime\":{\"id\":\"/properties/value/items/properties/phenomenonTime\",\"type\":\"string\",\"pattern\":\"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\\\.[0-9]{3}Z\"},\"result\":{\"id\":\"/properties/value/items/properties/result\",\"type\":\"number\"},\"sensusID\":{\"id\":\"/properties/value/items/properties/sensusID\",\"type\":\"string\"},\"resultTime\":{\"id\":\"/properties/value/items/properties/resultTime\",\"type\":\"string\",\"pattern\":\"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\\\.[0-9]{3}Z\"},\"parameters\":{\"id\":\"/properties/value/items/properties/parameters\",\"type\":\"object\"},\"datastream\":{\"id\":\"/properties/value/items/properties/datastream\",\"type\":\"object\"},\"Datastream@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/Datastream@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"FeatureOfInterest@iot.navigationLink\":{\"id\":\"/properties/value/items/properties/FeatureOfInterest@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"}},\"type\":\"object\"},\"required\":[\"@iot.id\",\"@iot.selfLink\",\"phenomenonTime\",\"result\",\"sensusID\",\"Datastream@iot.navigationLink\",\"FeatureOfInterest@iot.navigationLink\"],\"type\":\"array\"}},\"required\":[\"@iot.count\",\"value\"],\"type\":\"object\"}";
postman.setGlobalVariable("schema:observations", observations);

var observation = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"definitions\":{},\"id\":\"Specific Observation\",\"properties\":{\"@iot.id\":{\"id\":\"/properties/@iot.id\",\"type\":\"string\",\"pattern\":\"^[0-9]+$\"},\"@iot.selfLink\":{\"id\":\"/properties/@iot.selfLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"phenomenonTime\":{\"id\":\"/properties/phenomenonTime\",\"type\":\"string\",\"pattern\":\"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\\\.[0-9]{3}Z\"},\"result\":{\"id\":\"/properties/result\",\"type\":\"number\"},\"sensusID\":{\"id\":\"/properties/sensusID\",\"type\":\"string\"},\"resultTime\":{\"id\":\"/properties/resultTime\",\"type\":\"string\",\"pattern\":\"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\\\.[0-9]{3}Z\"},\"parameters\":{\"id\":\"/properties/parameters\",\"type\":\"object\"},\"datastream\":{\"id\":\"/properties/datastream\",\"type\":\"object\"},\"Datastream@iot.navigationLink\":{\"id\":\"/properties/Datastream@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"},\"FeatureOfInterest@iot.navigationLink\":{\"id\":\"/properties/FeatureOfInterest@iot.navigationLink\",\"type\":\"string\",\"pattern\":\"^http(s)?://\"}},\"required\":[\"@iot.id\",\"@iot.selfLink\",\"phenomenonTime\",\"result\",\"sensusID\",\"Datastream@iot.navigationLink\",\"FeatureOfInterest@iot.navigationLink\"],\"type\":\"object\"}";
postman.setGlobalVariable("schema:observation", observation);
