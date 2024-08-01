import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Costco test', it => {

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

    it('should return string which contains 11 items', function*(t) {
        let result;
        let productsId = ['100338551', '100244800', '100322290', '100338554', '100338550', '100236304', '100338555',
            '100236321', '100332786', '100236289', '100307600'];

        let js = fs.readFileSync('./market/costco.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/costco/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 11);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 items', function*(t) {
        let result;
        let productsId = ['100308970'];

        let js = fs.readFileSync('./market/costco.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/costco/ItemPage.html', 'utf8')
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
