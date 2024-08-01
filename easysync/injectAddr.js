'use strict';

(() => {
    if (!AddressBuffer) {
        console.log('AddressBuffer is not found!');
        return;
    }

    // наблюдатель нужен только на странице покупки,
    // где форма может появится в модалке
    if (AddressBuffer.isBuyPage()) {
        if (AddressBuffer.addressFormExists()) {
            AddressBuffer.insert();
        } else {
            new MutationObserver((mutations, observer) => {
                if (AddressBuffer.addressFormExists()) {
                    setTimeout(() => {
                        AddressBuffer.insert();
                    }, 500);
                    observer.disconnect();
                }
            }).observe(document.documentElement || document.body, {
                childList: true,
                subtree: true,
            });
        }
    } else {
        AddressBuffer.insert();
    }
})();
