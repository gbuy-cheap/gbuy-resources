const NOT_INJECTABLE_TABS=["chrome://","chrome-extension://","https://chromewebstore.google.com/"],checkAbilityOfInjection=e=>{let o=!0;for(var t of NOT_INJECTABLE_TABS)if(0===e.indexOf(t)){o=!1;break}return o};export{checkAbilityOfInjection};