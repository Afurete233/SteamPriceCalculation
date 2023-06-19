// ==UserScript==
// @name         SteamPriceCalculation_fast_to_see
// @namespace    https://afurete233.github.io/
// @version      1.0
// @description  fast_to_see
// @author       Afurete
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/axios/dist/axios.min.js
// ==/UserScript==

(function() {
    'use strict';

    var txtcss = "color: white;font-family: Motiva Sans, Arial, Helvetica, sans-serif;font-size: 26px;line-height: 32px;text-overflow: ellipsis;"
    var txtcss2 = "color: white;font-family: Motiva Sans, Arial, Helvetica, sans-serif;font-size: 20px;line-height: 32px;text-overflow: ellipsis;"

    var ui_main = document.createElement("div");
    var ui_car_Maxnum = document.createElement("span");
    ui_car_Maxnum.style.cssText = txtcss;
    var ui_car_allmoney = document.createElement("p");
    ui_car_allmoney.style.cssText = txtcss;

    var ui_displayallcard = document.createElement("p");
    ui_displayallcard.style.cssText = txtcss2;

    var ui_display_pj = document.createElement("p");
    ui_display_pj.style.cssText = txtcss2;

    var ui_display_now = document.createElement("p");
    var ui_display_or = document.createElement("p");
    ui_display_now.style.cssText = txtcss2;
    ui_display_or.style.cssText = txtcss2;


    ui_main.appendChild(ui_car_Maxnum);
    ui_main.appendChild(ui_car_allmoney);
    ui_main.appendChild(ui_displayallcard);
    ui_main.appendChild(ui_display_pj);
    ui_main.appendChild(ui_display_now);
    ui_main.appendChild(ui_display_or);

    document.getElementsByClassName("apphub_HeaderStandardTop")[0].appendChild(ui_main);


    var html = document.createElement('html');


    var numid = window.location.pathname.split('/')[2];
    var page = 1
    var url = 'https://steamcommunity.com/market/search?cc=us&q=&category_753_Game%5B0%5D=tag_app_' + numid +
        '&category_753_cardborder%5B0%5D=tag_cardborder_0&category_753_item_class%5B0%5D=tag_item_class_2&appid=753' +
        '&start=' + r3 + '&count=' + r3;
    var start_ = setInterval(() => {
        if (document.getElementsByClassName("discount_final_price") != null) {
            clearInterval(start_);
            rundata();
        }
    }, 300);

    var r3 = (page - 1) * 10;

    function rundata() {

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: async function(response) {
                var data = response;


                if (!data.responseXML) {
                    data.responseXML = new DOMParser().parseFromString(data.responseText, "text/xml");
                }
                var xmldata = data.responseText;
                html.innerHTML = xmldata;


                var car_Maxnum = html.querySelector('[id="searchResults_total"]').innerHTML;

                ui_car_Maxnum.innerHTML = '卡片总数为:' + car_Maxnum;


                if (car_Maxnum != 0) {

                    var Arnum = [];
                    var money;
                    if (document.getElementsByClassName("game_purchase_discount_countdown")[0] != null)
                        money = document.getElementsByClassName("discount_final_price")[0].innerHTML.split(' ')[0].replace(/[ \r\n\t\f\v]/g, '');
                    else
                        money = document.getElementsByClassName("game_purchase_price")[0].innerHTML.split(' ')[0].replace(/[ \r\n\t\f\v]/g, '');

                    console.log(money)

                    // 1 if getall < 10 else int(getall / 10) if getall % 10 == 0 else int(getall / 10) + 1
                    for (let moreCardTimes = 0; moreCardTimes < (car_Maxnum < 10 ? 1 : car_Maxnum % 10 == 0 ? parseInt(car_Maxnum / 10) : parseInt(car_Maxnum / 10) + 1); moreCardTimes++) {



                        const nownum = html.getElementsByClassName("market_listing_row_link");


                        for (let index = 0; index < nownum.length; index++) {
                            const element = html.querySelector('#result_' + index + ' > div.market_listing_price_listings_block > div.market_listing_right_cell.market_listing_their_price > span.market_table_value.normal_price > span.normal_price').innerHTML;
                            var f = element.replace(money, '').replace(',', '.');
                            Arnum.push(f)
                        }


                        if (car_Maxnum - (10 * page) > 0) {
                            page++;
                            r3 = (page - 1) * 10;
                            url = 'https://steamcommunity.com/market/search?cc=us&q=&category_753_Game%5B0%5D=tag_app_' +
                                numid + '&category_753_cardborder%5B0%5D=tag_cardborder_0&category_753_item_class%5B0%5D=tag_item_class_2&appid=753' +
                                '&start=' + 10 + '&count=' + 10;

                            let text = await wait();
                        }
                    }

                    var Allmoeny = 0.0;
                    var displayallcard = '';
                    for (let index = 0; index < Arnum.length; index++) {
                        displayallcard += (index + 1) + '·<span style="color:#549ce3">' + Arnum[index] + '</span>  '
                        Allmoeny += parseFloat(Arnum[index]);
                    }

                    ui_displayallcard.innerHTML = displayallcard;
                    ui_car_allmoney.innerHTML = '总共：<span style="color:#549ce3">' + money + ' ' + Allmoeny.toFixed(2) + '</span>';
                    const pj = (Allmoeny.toFixed(2) / car_Maxnum).toFixed(2);
                    const pj_no = (pj - (pj * 0.13)).toFixed(2);
                    ui_display_pj.innerHTML = '平均值:<span style="color:#d5cc48">' + pj + '</span> 去除手续费:<span style="color:#d5cc48">' + pj_no + '</span>';

                    let now_money;
                    if (document.getElementsByClassName("game_purchase_discount_countdown")[0] != null)
                        now_money = document.getElementsByClassName('discount_final_price')[0].innerHTML.split(' ')[1].split('(')[0].replace(',', '.');
                    else
                        now_money = document.getElementsByClassName('game_purchase_price')[0].innerHTML.split(' ')[1].split('(')[0].replace(',', '.');


                    const money_sp = now_money.split('.');
                    if (money_sp.length > 2) {
                        let money_sp2 = '';
                        for (let index = 0; index < money_sp.length; index++) {
                            if (index == money_sp.length - 1) {
                                money_sp2 += '.' + money_sp[index];
                            } else {
                                money_sp2 += money_sp[index];
                            }
                        }
                        now_money = money_sp2;
                    } else {
                        now_money = money_sp[0] + '.' + money_sp[money_sp.length - 1];
                    }

                    ui_display_now.innerHTML = '现价:<span style="color:#62d756">' + money + ' ' + now_money + '</span>';

                    let contnum = car_Maxnum % 2
                    if (contnum == 0) {
                        contnum = car_Maxnum / 2
                    } else {
                        contnum = parseInt(car_Maxnum / 2) + 1
                    }

                    const DB1 = (pj_no * contnum).toFixed(2);
                    const overPrice = (DB1 - parseFloat(now_money)).toFixed(2);

                    if (DB1 > parseFloat(now_money)) {
                        ui_display_or.innerHTML = DB1 + '>' + now_money + '     <span>可卖卡回本:</span><span style="color:#21dc59">' + overPrice + '</span>';
                    } else {
                        ui_display_or.innerHTML = DB1 + '<' + now_money + '     <span>无回本:</span><span style="color:#d42521">' + overPrice + '</span>';
                    }

                }




            }
        })
    }


    function wait() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var data = response;
                    if (!data.responseXML) {
                        data.responseXML = new DOMParser().parseFromString(data.responseText, "text/xml");
                    }
                    var xmldata = data.responseText
                    html.innerHTML = xmldata;

                    resolve(data.responseText);

                }
            })
        })

    }



})();