import {describe} from 'ava-spec';
const fs = require('fs');
let jsdom = require("jsdom");
const LocalStorage = require('node-localstorage').LocalStorage;

describe('Aliexpress test', it => {

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

    it('should return string which contains 48 items', function* (t) {

        let result;
        let productsId = ['32252805701', '32394671201', '32301150475', '32514860647', '32415288111', '32785275286',
            '32685457151', '32740230124', '32310044939', '1909518005', '32668211931', '32808143664', '32376315738',
            '32653496708', '32624096194', '32358039306', '32542438730', '32573586633', '32757113189', '32801568263',
            '32676639532', '32247565979', '32580150180', '32784778931', '32529693631', '32660299384', '32400218193',
            '32772220940', '32581803434', '2039561409', '32686594625', '32667575324', '2027459296', '32665419103',
            '32371172526', '32806503402', '32646588315', '32305220856', '32606773491', '32493963824', '32246447439',
            '32456025093', '32708864322', '32793018903', '1883909957', '32235671088', '32417806738', '32604293106'];

        let js = fs.readFileSync('./market/aliexpress.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/aliexpress/SearchPage1.html', 'utf8')
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
        t.is(JSON.parse(result).length, 48);
        t.is(productsId.length, 0);

    });

    it('should return string which contains 93 items', function* (t) {

        let result;
        let productsId = ['32722117558', '32787193402', '32722101302', '32794838752', '1000003468110', '1000003464094',
            '32786921225', '32797963464', '32776949535', '32768209282', '32787326454', '32683118224', '32793220170',
            '32790475282', '32798895346', '32796162656', '32704454890', '32774056286', '32776605970', '32768018975',
            '32753189151', '32788336393', '32784651040', '32749624747', '32674266735', '32785315766', '32798895282',
            '32802188769', '32657785169', '32676694023', '32773556669', '32779342489', '32737475038', '32710814554',
            '32763926521', '32712493904', '32685655934', '32792757641', '32776509759', '1000001877900', '32780119845',
            '32717453262', '32780295016', '32793807594', '32703703848', '32765819261', '32674266735', '32785315766',
            '32794838752', '1000003468110', '1000003464094', '32786921225', '32797963464', '32776949535', '32768209282',
            '32787326454', '32683118224', '32793220170', '32790475282', '32798895346', '32796162656', '32704454890',
            '32774056286', '32776605970', '32768018975', '32753189151', '32788336393', '32784651040', '32749624747',
            '32674266735', '32785315766', '32798895282', '32802188769', '32657785169', '32676694023', '32773556669',
            '32779342489', '32737475038', '32710814554', '32763926521', '32712493904', '32685655934', '32792757641',
            '32776509759', '1000001877900', '32780119845', '32717453262', '32780295016', '32793807594', '32703703848',
            '32765819261', '32674266735', '32785315766'];

        let js = fs.readFileSync('./market/aliexpress.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/aliexpress/SearchPage2.html', 'utf8')
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
        t.is(JSON.parse(result).length, 93);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 9 items', function* (t) {

        let result;
        let productsId = ['32722117558-200000828:200003982#Standard;14:193;200007763:201336100',
            '32722117558-200000828:200003982#Standard;14:193;200007763:201336104',
            '32722117558-200000828:200003982#Standard;14:193;200007763:201336103',
            '32722117558-200000828:200003982#Standard;14:175;200007763:201336100',
            '32722117558-200000828:200003982#Standard;14:175;200007763:201336104',
            '32722117558-200000828:200003982#Standard;14:175;200007763:201336103',
            '32722117558-200000828:200003982#Standard;14:366;200007763:201336100',
            '32722117558-200000828:200003982#Standard;14:366;200007763:201336104',
            '32722117558-200000828:200003982#Standard;14:366;200007763:201336103'];

        let js = fs.readFileSync('./market/aliexpress.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/aliexpress/ItemPageSomeVars.html', 'utf8')
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
        t.is(JSON.parse(result).length, 9);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 59 items', function* (t) {

        let result;
        let productsId = ['32709107037', '32706801710', '32707768855', '32707341965', '32709087669', '32709144324',
            '32706797705', '32711128289', '32709591766', '32709144016', '32710106596', '32710343351', '32709071961',
            '32707760513', '32707768881', '32709936570', '32707361724', '32708424862', '32707832484', '32723236501',
            '32723507446', '32708512221', '32706990842', '32707010816', '32707706455', '32724501066', '32749624381',
            '32708133442', '32737800305', '32718280615', '32710343351', '32709144017', '32709116962', '32758298322',
            '32709144324', '32756800172', '32757442097', '32749846317', '32708474607', '32787073250', '32787832892',
            '32786308398', '32782465485', '32785291583', '32785367040', '32782944011', '32782670719', '32782085805',
            '32782160782', '32782152914', '32782042126', '32780269211', '32781080553', '32783111744', '32783111726',
            '32783135543', '32779927674', '32777826718', '32776553554'];

        let js = fs.readFileSync('./market/aliexpress.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/aliexpress/HomePage.html', 'utf8')
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

        /*let temp = JSON.parse(result);
         for(let i of temp) console.log("'" + i.productId + "'")*/

        t.is(typeof result, 'string');
        t.is(JSON.parse(result).length, 59);
        t.is(productsId.length, 0);
    });

    it('should return string which contains 1 item', function* (t) {

        let result;
        let productsId = ['32563043689'];

        let js = fs.readFileSync('./market/aliexpress.js', 'utf8');
        const html = fs.readFileSync('./tests/pages/aliexpress/ItemPageOneVar.html', 'utf8')
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