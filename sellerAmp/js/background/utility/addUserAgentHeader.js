"use strict";import{headerOperation}from"../constants/declarativeNetRequestConstants.js";import{ruleNameIDs}from"../constants/ruleNameIDs.js";import{SAS_USER_AGENT_MASK}from"../constants/urlMasks.js";import{netRequestAPI}from"./netRequestAPI.js";import{sentrySellerAmp}from"../../content/sentrySellerAmp/sentrySellerAmp.js";import{userAgent}from"../constants/userAgent.js";const addUserAgentHeader=()=>{var e=[{operation:headerOperation.REMOVE,header:"UserAgent"}];netRequestAPI.updateRequestHeaders({id:ruleNameIDs.removeUserAgentOfHomepage,requestHeaders:e,urlFilter:"https://www.amazon*/gp/css/homepage.html"}),SAS_USER_AGENT_MASK.forEach(addHeaderToResponse)},addHeaderToResponse=e=>{chrome.webRequest.onSendHeaders.addListener(createHandler(),{urls:[e]},["requestHeaders"])},createHandler=()=>()=>{sentrySellerAmp.wrap(function(){addUserAgent()})},addUserAgent=()=>{var e=userAgent.value;e&&(e=[{operation:headerOperation.SET,header:"User-Agent",value:e}],netRequestAPI.updateRequestHeaders({id:ruleNameIDs.setUserAgentOfGettingSessionID,requestHeaders:e,urlFilter:"https://www.amazon*/amazonprime"}),netRequestAPI.updateRequestHeaders({id:ruleNameIDs.setUserAgentOfGettingUbID,requestHeaders:e,urlFilter:"https://www.amazon*/portal-migration/hz/glow/get-rendered-toaster*"}))};export{addUserAgentHeader};