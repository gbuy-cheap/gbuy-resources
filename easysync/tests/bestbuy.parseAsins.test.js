import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Bestbuy test', it => {

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

    it('should return string which contains 24 items', function* (t) {
        let result;
        let productsId = ['5656023', '5433200', '5027401', '5027201', '5027600', '5387104', '5624229', '5787003',
            '5278601', '5005645', '5005650', '5005671', '5787000', '5787101', '5278500', '5450160', '5026700',
            '5387201', '5624153', '5279302', '5713006', '4644602', '5792111', '3953367'];

        let js = fs.readFileSync('./market/bestbuy.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/bestbuy/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 24);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 4 items', function* (t) {
        let result;
        let productsId = ['5773831', '5773814', '5773826', '5773832'];

        let js = fs.readFileSync('./market/bestbuy.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/bestbuy/ItemPageSomeVars.html', 'utf8')
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
        t.is(JSON.parse(result).length, 4);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function* (t) {
        let result;
        let productsId = ['5621780'];

        let js = fs.readFileSync('./market/bestbuy.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/bestbuy/ItemPageOneVar.html', 'utf8')
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
