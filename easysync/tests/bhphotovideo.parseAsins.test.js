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

    it('should return string which contains 24 items', function*(t) {
        let result;
        let productsId = ['1297676-REG', '1298952-REG', '1264119-REG', '1153152-REG', '1264649-REG', '1260392-REG',
            '1282309-REG', '1292192-REG', '1253754-REG', '1274810-REG', '1292737-REG', '1326545-REG', '1272842-REG',
            '1279532-REG', '1292189-REG', '1257991-REG', '1260361-REG', '1262894-REG', '1272948-REG', '1266080-REG',
            '1294296-REG', '1292076-REG', '1282373-REG', '1262569-REG'];

        let js = fs.readFileSync('./market/bhphotovideo.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/bhphotovideo/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 24);
       t.is(productsId.length, 0);
    });

    it('should return string which contains 2 items', function*(t) {
        let result;
        let productsId = ['1288579-REG', '1264119-REG'];

        let js = fs.readFileSync('./market/bhphotovideo.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/bhphotovideo/ItemPage.html', 'utf8')
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

        /*let temp = JSON.parse(result);
         for(let i of temp) console.log("'" + i.productId + "'")*/

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 2);
        t.is(productsId.length, 0);
    });

});
