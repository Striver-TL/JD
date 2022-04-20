/*
 * @Author: your name
 * @Date: 2020-07-04 13:00:57
 * @LastEditTime: 2020-07-08 09:07:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /二期项目——京东商城/index.js
 */

const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const router = require("koa-router")();
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");

router.post("/productData", getData(path.join(__dirname, "/data/productData.json")));

router.post("/senData", getData(path.join(__dirname, "/data/senData.json")));

router.post("/specialData", getData(path.join(__dirname, "/data/specialData.json")));

router.post("/seckillData", getData(path.join(__dirname, "/data/seckillData.json")));

router.post("/categoryData", getData(path.join(__dirname, "/data/categoryData.json")));

router.post("/cartData", async ctx => {
    await new Promise((resolve, reject) => {
        ctx.req.on("data", data => {
            try {
                let obj = JSON.parse(data.toString()),
                    arr = [];
                let stack = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/productData.json")).toString());
                for (let key in obj) {
                    stack.forEach(e => {
                        e.forEach(el => {
                            if (el.id === key) {
                                arr.push(el);
                            }
                        });
                    });
                }
                resolve(arr);
            } catch (err) {
                reject(err);
            }
        });
    }).then(obj => {
        ctx.body = JSON.stringify(obj);
    }).catch(err => {
        ctx.body = null;
    });
});

app.use(static(__dirname + "/"));

app.use(router.routes());

app.listen(8080, () => {
    console.log("Server is running at localhost:8080");
});


function getData(url) {
    return async ctx => {
        let proData = JSON.parse(fs.readFileSync(url, err => {
            if (err) {
                reject(err);
            }
        }).toString());
        await new Promise((resolve, reject) => {
            try {
                ctx.req.on("data", data => {
                    if (+data < 0) {
                        reject(err);
                    }
                    resolve(proData[+data] ? proData[+data] : []);
                });
            } catch (err) {
                reject(err);
            }
        }).then(data => {
            ctx.body = JSON.stringify(data);
        }).catch(err => {
            console.log(err);
        });
    }
}