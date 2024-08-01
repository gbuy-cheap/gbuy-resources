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

    it('should return string which contains 42 items', function*(t) {
        let result;
        let productsId = ['030VA88095212P', 'SPM13467116624', '030VA86932312P', '088VA88279912P', '08879601099P',
            '088VA94254712P', 'SPM8999129724', '088VA94758912P', '088VA88021912P', '088VA85169512P', '030VA54336112P',
            '088VA90141712P', '08837455099P', '3ZZVA56515212P', '3ZZVA56513812P', '3ZZVA56512312P', '3ZZVA56511512P',
            '3ZZVA56514712P', '3ZZVA56514112P', '3ZZVA56512612P', '3ZZVA56513712P', '3ZZVA56512912P', '3ZZVA56514812P',
            '049VA2714701P', '3ZZVA56512112P', '3ZZVA56511912P', '3ZZVA70211012P', '033VA89719112P', 'SPM11120119813',
            '01401279000P', '04931453000P', '01412791000P', '3ZZVA53880612P', '08836323099P', '08879538099P', '088VA86642812P',
            '024W007103527001P', '08886189099P', '04932594000P', '024W006444058001P', '024W007323862001P', '04930668000P'];

        let js = fs.readFileSync('./market/sears.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/sears/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 42);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function*(t) {
        let result;
        let productsId = ['030VA88095212P'];

        let js = fs.readFileSync('./market/sears.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/sears/ItemPageOneVar.html', 'utf8')
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
