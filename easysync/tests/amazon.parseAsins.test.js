import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Amazon test', it => {

    function getData(html, pageScript) {
        const scripts = ['https://code.jquery.com/jquery-3.2.1.min.js'];

        return new Promise((resolve, reject) =>{
            const done = function(errors, window)
            {
                const document = window.document;
                window.localStorage = new LocalStorage('./tests/localStorageTemp');
                eval(pageScript);
                if(errors) {
                    reject(errors);
                }
                const result = window.localStorage.getItem('easyncItemIds');
                window.localStorage.setItem('easyncItemIds', '');
                resolve(result);
            };

            const config = { html, done, scripts };
            jsdom.env(config);
        }).catch((e) => {
            throw e;
        });
    }

    it('should return string which contains 51 items', function* (t) {

        let result;
        let productsId = ['B00EE4V0PM', 'B01FSC7R8M', 'B00ASBOP9S', 'B01LY3QXGP', 'B00G36F8IO', 'B00G2DN4KC',
            'B01EWK0ZZS', 'B01N8VE4AF', 'B01DW1TEQ4', 'B018LVAYA0', 'B007PKJ0X6', 'B01FG9WO3K', 'B01JOVOJM0',
            'B01ICH8VR6', 'B00NG7GDOG', 'B010B2LLOK', 'B01D58K0Q2', 'B018HFT6TK', 'B01KT18YQQ', 'B006XISCNA',
            'B01MQO95XC', 'B01MFBRHGM', 'B00JVHAGS4', 'B01M4QPUXW', 'B01JH9690E', 'B01N59Z10C', 'B011VZNHQG',
            'B01LXWJO7L', 'B06XW6WLKP', 'B019ZTZTVQ', 'B06W2LQTJW', 'B01M0GEAF0', 'B01ICGO1KS', 'B00YHEKUKK',
            'B06XSYTK5F', 'B00PS2HWQK', 'B06Y5ZM4HS', 'B01IE22H9M', 'B000AB286S', 'B01J8UKRH8', 'B00BSYR7K8',
            'B06XY3SJMH', 'B00M8ZEALK', 'B002VP6O9I', 'B00UTFZAII', 'B0089RHOKU', 'B001TR0UZI', 'B003U6A3C6',
            'B018BJL09Q', 'B01MFXJKUA', 'B0183IDCHS'];

        let js = fs.readFileSync('./market/amazon.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/amazon/SearchPage1.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok=> result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for(let i of obj) {
            for(let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j,1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 51);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 30 items', function* (t) {

        let result;
        let productsId = ['B01N6Y0ZWJ', 'B018CW925Q', 'B01FICEFNM', 'B01MTQ8F9C', 'B01HCQEB90', 'B01K3ZR0RC',
            'B01NAGY8HG', 'B00KVOR9VI', 'B01LZ8BYF8', 'B01LXMOHTZ', 'B00PM722OI', 'B01C0EFTCM', 'B009QAPKL4',
            'B00Y2CQRZY', 'B01KVGKLZG', 'B01KE3E89G', 'B001THPA58', 'B01IG6C0D4', 'B0089FUF6W', 'B00X61AJYM',
            'B01NH53RBH', 'B01KVYTV86', 'B00022W4ZU', 'B01COOQIKU', 'B01CKHENFS', 'B00XM8HTIS', 'B01H4ZBRWS',
            'B01M1P8EN8', 'B00ISGCDC6', 'B012ZPKNFE'];

        let js = fs.readFileSync('./market/amazon.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/amazon/GoldBoxPage.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok=> result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for(let i of obj) {
            for(let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j,1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 30);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 20 items', function* (t) {

        let result;
        let productsId = ['159514188X', '0553447084', '152473313X', '1250120616', '1455570249', '0679805273',
            '0544609719', '144947425X', '0385534248', '0062300547', '014198600X', '038549081X', '0312510780',
            '1455565237', '0762447699', '0062457713', '0385376715', '080241270X', '1524732680', '1400052181'];

        let js = fs.readFileSync('./market/amazon.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/amazon/BestPage.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/mg, '');

        yield getData(html, js)
            .then(ok=> result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for(let i of obj) {
            for(let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j,1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 20);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 13 items', function* (t) {

        let result;
        let productsId = ['B01FRKIVZ8', 'B01FRKIV9Y', 'B01FRKIWXO', 'B01LYBB3WA', 'B01M0X5RYP', 'B01HJ0UBPC',
            'B01N6HS5U8', 'B01MXZ535C', 'B01N9I4MJJ', 'B01LXZPD1Q', 'B01M1KE48Y', 'B01LX0H0SL', 'B01FRKIXTM'];

        let js = fs.readFileSync('./market/amazon.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/amazon/ItemPageSomeVars.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok=> result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for(let i of obj) {
            for(let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j,1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 13);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function* (t) {

        let result;
        let productsId = ['B0010E1LYY'];

        let js = fs.readFileSync('./market/amazon.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/amazon/ItemPageOneVar.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok=> result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for(let i of obj) {
            for(let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j,1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 1);
        t.is(productsId.length, 0);
    });

});
