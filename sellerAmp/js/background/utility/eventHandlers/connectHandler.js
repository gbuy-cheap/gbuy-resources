"use strict";import{sentrySellerAmp}from"../../../content/sentrySellerAmp/sentrySellerAmp.js";const connectHandler=e=>{sentrySellerAmp.wrap(function(){handleEvent(e)})},handleEvent=e=>{e.onMessage.addListener(function(){e.postMessage({response:"Message received successfully!"})})};export{connectHandler};