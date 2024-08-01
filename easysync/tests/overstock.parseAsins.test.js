import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Overstock test', it => {

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

    it('should return string which contains 60 items', function*(t) {
        let result;
        let productsId = ['10042649', '11131672', '11820644', '9666018', '9662872', '8093692', '10102408', '10175899',
            '10614321', '10812396', '5561871', '11528497', '3446324', '10175928', '10122539', '12173355', '4469244',
            '9207124', '8212520', '12681951', '8496844', '12676853', '14627838', '3958041', '14574870', '14788216',
            '13309723', '12681955', '11188369', '12344440', '13477362', '11390359', '5807117', '8212519', '13549899',
            '11390368', '11717554', '13839534', '13548601', '12319751', '11624853', '2025889', '9628131', '8016378',
            '11594975', '11390373', '13045057', '13219348', '10062561', '10043576', '9627489', '8087453', '14678635',
            '14678631', '14678592', '11047379', '10099540', '13180664', '10078694', '11746567'];

        let js = fs.readFileSync('./market/overstock.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/overstock/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 60);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 59 items', function*(t) {
        let result;
        let productsId = ['11643614', '10296254', '11131242', '12364472', '11131216', '11643665', '10218866',
            '10296253', '13556669', '11861950', '10383011', '10642789', '11861802', '9782981', '14103492',
            '11161583', '9507783', '12364493', '10884710', '14514668', '11629984', '10218867', '14103476',
            '14103467', '14705550', '14123615', '10296267', '10707229', '8240427', '11161582', '12353696',
            '2915654', '12365378', '11976112', '14103452', '10218865', '14103481', '14504794', '14103455',
            '14103555', '14103482', '14103465', '14103488', '14103504', '14456868', '14103472', '14216975',
            '14103486', '14103477', '14103474', '14103501', '14103470', '10382990', '10423899', '10382982',
            '8749150', '8672034', '10175249', '14504904'];

        let js = fs.readFileSync('./market/overstock.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/overstock/SearchPage2.html', 'utf8')
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
        t.is(JSON.parse(result).length, 59);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 6 items', function*(t) {
        let result;
        let productsId = ['14574644-24309363', '14574644-24309364', '14574644-24309362', '14574644-24309365',
            '14574644-24309366', '14574644-24309367'];

        let js = fs.readFileSync('./market/overstock.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/overstock/ItemPageSomeVars.html', 'utf8')
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
        t.is(JSON.parse(result).length, 6);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function*(t) {
        let result;
        let productsId = ['13195764'];

        let js = fs.readFileSync('./market/overstock.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/overstock/ItemPageOneVar.html', 'utf8')
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
