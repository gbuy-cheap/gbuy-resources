import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Sears test', it => {

    function getData(html, pageScript) {
        const scripts = ['https://code.jquery.com/jquery-3.2.1.min.js'];

        return new Promise((resolve, reject) => {
            const done = function (errors, window) {
                const document = window.document;
                window.localStorage = new LocalStorage('./tests/localStorageTemp');
                eval(pageScript);
                if (errors) {
                    reject(errors);
                }
                const result = window.localStorage.getItem('easyncItemIds');
                window.localStorage.setItem('easyncItemIds', '');
                resolve(result);
            };

            const config = {html, done, scripts};
            jsdom.env(config);
        }).catch((e) => {
            throw e;
        });
    }

    it('should return string which contains 20 items', function*(t) {
        let result;
        let productsId = ['51352483', '53126987', '51352484', '46466500', '36482876', '54772929', '51413964', '46728046',
            '46021931', '40549524', '102531407', '106473215', '107062913', '184088770', '51047165', '44657945',
            '51756154', '44618319', '51413977', '44786040'];

        let js = fs.readFileSync('./market/walmart.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/walmart/SearchPage1.html', 'utf8')
            .toString()
            .replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok => result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for (let i of obj) {
            for (let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j, 1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 20);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 21 items', function*(t) {
        let result;
        let productsId = ['6HLY48U9ENUR', '7CYO1AQ7H3CX', '619R2NP4M8UE', '60SNO3YW0UMG', '72744SRNZ751',
            '47WF8ROBI94L', '2N1VAGMUR2CQ', '15RY5G9BZ204', '3PJVVRYXA14W', '6D8EQHB1AXIB', '76M56MHBWTJA',
            '3MFUQHC86IYO', '53C0TPCYKQ8J', '74D7C48SW6SK', '2W2SHNLWG8Z5', '5A3M632MYFYW', '5O6QMAJHYGKN',
            '37EMHBZQ5IRM', '5GCQ5YNNZ3A9', '6GG88TF8D939', '2PH1RSJY5UOD'];

        let js = fs.readFileSync('./market/walmart.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/walmart/ItemPageSomeVars.html', 'utf8')
            .toString();
            //.replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok => result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for (let i of obj) {
            for (let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j, 1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 21);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function*(t) {
        let result;
        let productsId = ['4Q673910883S'];

        let js = fs.readFileSync('./market/walmart.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/walmart/ItemPageOneVar.html', 'utf8')
            .toString();
        //.replace(/script/gim, '');
        js = js.replace(/.scrollIntoView\((.+)\)/m, '');

        yield getData(html, js)
            .then(ok => result = ok)
            .catch(e => console.log(e));

        let obj = JSON.parse(result);
        for (let i of obj) {
            for (let j in productsId) {
                if (i.productId.toString() === productsId[j]) {
                    productsId.splice(j, 1);
                }
            }
        }

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 1);
        t.is(productsId.length, 0);
    });

});
