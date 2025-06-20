/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements.
 * Licensed under the Elastic License; you may not use this file except in compliance with the Elastic License. */
(window["ml_bundle_jsonpfunction"]=window["ml_bundle_jsonpfunction"]||[]).push([[17],{347:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"AnomalyDetectorService",(function(){return AnomalyDetectorService}));var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(18);var rxjs_operators__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__);var _ml_api_service__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(50);function _createForOfIteratorHelper(o,allowArrayLike){var it;if(typeof Symbol==="undefined"||o[Symbol.iterator]==null){if(Array.isArray(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function F(){};return{s:F,n:function n(){if(i>=o.length)return{done:true};return{done:false,value:o[i++]}},e:function e(_e){throw _e},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var normalCompletion=true,didErr=false,err;return{s:function s(){it=o[Symbol.iterator]()},n:function n(){var step=it.next();normalCompletion=step.done;return step},e:function e(_e2){didErr=true;err=_e2},f:function f(){try{if(!normalCompletion&&it.return!=null)it.return()}finally{if(didErr)throw err}}}}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class AnomalyDetectorService{constructor(httpService){this.httpService=httpService;_defineProperty(this,"apiBasePath",Object(_ml_api_service__WEBPACK_IMPORTED_MODULE_1__["basePath"])()+"/anomaly_detectors")}getJobById$(jobId){return this.httpService.http$({path:"".concat(this.apiBasePath,"/").concat(jobId)}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])(response=>response.jobs[0]))}getJobs$(jobIds){return this.httpService.http$({path:"".concat(this.apiBasePath,"/").concat(jobIds.join(","))}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])(response=>response.jobs))}extractInfluencers(jobs){if(!Array.isArray(jobs)){jobs=[jobs]}const influencers=new Set;var _iterator=_createForOfIteratorHelper(jobs),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){const job=_step.value;var _iterator2=_createForOfIteratorHelper(job.analysis_config.influencers),_step2;try{for(_iterator2.s();!(_step2=_iterator2.n()).done;){const influencer=_step2.value;influencers.add(influencer)}}catch(err){_iterator2.e(err)}finally{_iterator2.f()}}}catch(err){_iterator.e(err)}finally{_iterator.f()}return Array.from(influencers)}}}}]);