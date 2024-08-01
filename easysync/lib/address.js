'use strict';

const AddressBuffer = {
    addAddressOnAddressPage: function(dataObj) {
        document.querySelector('#address-ui-widgets-countryCode .a-button-text').click();
        setTimeout(() => {
            document.querySelector(`[data-value*="${dataObj.billingAddress.country}"]`).click();
        }, 1000);
        document.querySelector(
            '#address-ui-widgets-enterAddressFullName'
        ).value = `${dataObj.billingAddress.firstName} ${dataObj.billingAddress.lastName}`;
        document.querySelector('#address-ui-widgets-enterAddressLine1').value = dataObj.billingAddress.addressLine1;
        document.querySelector('#address-ui-widgets-enterAddressCity').value = dataObj.billingAddress.city;
        document.querySelector('#address-ui-widgets-enterAddressStateOrRegion').value = dataObj.billingAddress.state;
        document.querySelector('#address-ui-widgets-enterAddressPostalCode').value = dataObj.billingAddress.zip;
        document.querySelector('#address-ui-widgets-enterAddressPhoneNumber').value = dataObj.billingAddress.phone;
    },

    addAddressOnBuyPage: function(dataObj) {
        // prettier-ignore
        $(
            document.querySelector('#enterAddressFullName, #address-ui-widgets-enterAddressFullName, #addr_0name')
        ).val(dataObj.name);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressAddressLine1, #address-ui-widgets-enterAddressLine1, #addr_0address1')
        ).val(dataObj.street1);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressAddressLine2, #address-ui-widgets-enterAddressLine2, #addr_0address2')
        ).val(dataObj.street2);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressCity, #address-ui-widgets-enterAddressCity, #addr_0city')
        ).val(dataObj.city);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressStateOrRegion, #address-ui-widgets-enterAddressStateOrRegion, #addr_0state')
        ).val(dataObj.stateOrProvince);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressPostalCode, #address-ui-widgets-enterAddressPostalCode, #addr_0zip')
        ).val(dataObj.postalCode);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressPhoneNumber, #address-ui-widgets-enterAddressPhoneNumber, #addr_0voice')
        ).val(dataObj.phone);
        // prettier-ignore
        $(
            document.querySelector('#enterAddressCountryCode, select#address-ui-widgets-countryCode, #addr_0countryCode')
        ).val(dataObj.country);
    },

    getTextFromBuffer: function(cb) {
        const textarea = document.createElement('textarea');

        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        document.execCommand('Paste');
        try {
            const dataObj = JSON.parse(textarea.value.replace(/(\r\n|\n|\r)/gm, '').trim());
            cb(dataObj);
        } catch (error) {
            console.log('getTextFromBuffer', error);
        } finally {
            document.body.removeChild(textarea);
        }
    },

    isBuyPage: function() {
        return /^https:\/\/(www\.)?amazon\.(com|fr|co.uk|ca|de|it|es|co.jp)\/gp\/buy\//.test(location.href);
    },

    isAddressPage: function() {
        return /^https:\/\/(www\.)?amazon\.(com|fr|co.uk|ca|de|it|es|co.jp)\/a\/addresses\/add/.test(location.href);
    },

    addressFormExists: function() {
        return (
            $('#enterAddressFullName').length ||
            $('#address-ui-widgets-enterAddressFullName').length ||
            $('#addr_0name').length
        );
    },

    insert: function() {
        if (this.isAddressPage()) {
            console.log('Address Page');
            this.getTextFromBuffer(this.addAddressOnAddressPage);
        } else if (this.isBuyPage()) {
            console.log('Buy Page');
            this.getTextFromBuffer(this.addAddressOnBuyPage);
        } else {
            console.log('Incorrect page to paste the address!');
        }
    },
};
