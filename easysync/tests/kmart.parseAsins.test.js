import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Kmart test', it => {

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

    it('should return string which contains 48 items', function*(t) {
        let result;
        let productsId = ['042VA71694112P', '046VA94508812P', '042VA80868712P', '046VA78895212P', '046VA82246312P',
            '041VA56494112P', '046VA95108812P', '046B022690020001P', '042VA89413412P', '046VA88920512P', '041VA67278612P',
            '041VA67278712P', '046VA94509212P', '041VA55904412P', '046W795253180001P', '042VA86070412P', '046B022706840001P',
            '046VA90820712P', '042VA94961612P', '046VA94509012P', '046VA86729612P', '041K0731000P', '999000VP58516411P',
            '046VA91444112P', '999000VP58522911P', '046VA56320612P', '046W024575159000P', '042VA67106112P', '042VA90942112P',
            '046VA66901612P', '99900600ZM010000P', '046VA95081012P', '041VA67609712P', '046VA92271212P', '046VA85640512P',
            '046VA91248412P', '046B020596380001P', '042VA85891512P', '3ZZVA57181712P', '046VA94542512P', '046VA66905712P',
            '042VA67123012P', '042VA94962812P', '043VA96960512P', '041VA57488912P', '046VA72872012P', '046VA95064012P',
            '042VA76739812P'];

        let js = fs.readFileSync('./market/kmart.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/kmart/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 48);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function*(t) {
        let result;
        let productsId = ['027VA86100312P'];

        let js = fs.readFileSync('./market/kmart.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/kmart/ItemPage.html', 'utf8')
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
        t.is(JSON.parse(result).length, 1);
        t.is(productsId.length, 0);
    });
});
