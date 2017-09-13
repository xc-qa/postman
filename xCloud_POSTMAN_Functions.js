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
