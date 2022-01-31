from http.cookiejar import Cookie
import requests
import re
from fake_useragent import UserAgent
from requests.api import get
from requests.packages import urllib3
from lxml import etree
from bs4 import BeautifulSoup
from decimal import Decimal
import json
from colorama import init,Fore
import pyperclip
import time
import os
import keyboard
from pykeyboard import PyKeyboard



init(autoreset=True)


country = ["ARS$","pуб."]  
country_shop = ["ar","ru"]  

if (os.path.exists("cookie.txt")) :
    with open("cookie.txt", "r") as f:  # 打开文件
        Cookie_text = f.read()  # 读取文件
else :
    print('cookie文件不存在')
    time.sleep(1)
    os._exit()
   
header = {
            'Cookie':Cookie_text
            }   
    

def main():
    
   

    print(Fore.MAGENTA+'----------------------------\n\n')
    
    numid = 0
    pyperclip.copy('0')

    print('等待键盘按下【F4】......')
    while True:
        time.sleep(0.2)
        if keyboard.is_pressed('F4'):
            print("\n价格判断中.....")
            time.sleep(0.6)
            k = PyKeyboard()
            k.press_key(k.alt_key) # 按下
            k.tap_key('d') # 按下
            k.release_key(k.alt_key)
            time.sleep(0.2)
            k.press_key(k.control_key)
            k.tap_key('c')
            k.release_key(k.control_key)
            urlget_str= pyperclip.paste()
            # print(urlget_str)
            Surl= urlget_str.replace('https://store.steampowered.com/app/','').split('/')
            numid =  Surl[0]
            if(len(numid)>3):
                try:
                    int(numid)
                    break
                except ValueError:
                    print("获取错误请重新尝试1.....")
                    numid = 0
                    pyperclip.copy('0')
            else:
                print("获取错误请重新尝试2.....")
                numid = 0
                pyperclip.copy('0')
                
    # numid = input('请输入游戏id\n').replace(" ","")


    try:
        int(numid)
    except ValueError:
        print('输入错误')
        main()

    url = 'https://steamcommunity.com/market/search?cc=us&q=&category_753_Game%5B0%5D=tag_app_'+numid + \
        '&category_753_cardborder%5B0%5D=tag_cardborder_0&category_753_item_class%5B0%5D=tag_item_class_2&appid=753#p1_name_desc'

    
    urllib3.disable_warnings()

    try:
        r = requests.get(url, verify=False,proxies = None,headers = header,timeout=10)
        
        data = BeautifulSoup(r.text, 'lxml')
        
    except Exception as e:
        print(Fore.RED+'\n网络异常:'+str(e))
        main()

        

    name = data.select(
        '#BG_bottom > div.market_search_results_header > div > a:nth-child(2)')
    for item in name:
        name = {
            "name": item.get_text()
        }
        displayname = name['name']
        print(displayname)

    getall = data.select('#searchResults_total')
    for item in getall:
        result = {
            "num": item.get_text()
        }
        getall = int(result['num'])
        print('卡片总数为:'+Fore.YELLOW+str(getall))
    Arnum = []
    if getall == 0:
        print('游戏无卡片')
        main()

    i = 1
    for num in range(0, getall):
        getdata = data.select(
            '#result_'+str(num)+' > div.market_listing_price_listings_block > div.market_listing_right_cell.market_listing_their_price > span.market_table_value.normal_price > span.normal_price')
        for item in getdata:
            yuan = {
                "yuan": item.get_text()
            }

            print(str(i)+'_'+Fore.CYAN+yuan['yuan']+' ',end='')
            
            try :
                f = float(yuan['yuan'].replace(country[countryid], '').replace(',','.'))
            except Exception as e:
                print(Fore.RED+'\n Cookie已过期')
                main()


            i = i+1
            if(i==8 or i==16):
                print("\n")
            # ok2f = Decimal(f).quantize(Decimal('0.00'))
            Arnum.append(f)

    Allcont = 0
    for num in Arnum:
        # print(str(i)+'_ '+str(num)+'    ', end='')
        Allcont = float(num)+Allcont


    print("\n\n总共："+Fore.CYAN+str(Allcont)+"\n")
    pj = float(Decimal(Allcont/getall).quantize(Decimal('0.00')))
    pj_no = pj-(pj*0.13)
    print('平均值'+Fore.YELLOW+str(pj)+Fore.RESET+'去除手续费:'+Fore.YELLOW+str(Decimal(pj_no).quantize(Decimal('0.00')))+Fore.RESET+"\n")

    contnum = getall % 2
    if contnum == 0:
        contnum = getall/2
    else:
        contnum = int(getall/2)+1

    DB1 = float(Decimal(float(pj_no*contnum)).quantize(Decimal('0.00')))


    urldy = 'https://store.steampowered.com/api/appdetails?appids='+numid+'&filters=price_overview&cc='+country_shop[countryid]

    try :
        get1 = requests.get(urldy, verify=False,proxies = None,headers=header, timeout=10)
    except Exception as e:
        print(Fore.RED+'\n网络异常:'+str(e))
        main()
        
    get2 = json.loads(get1.text)

    data_1 = get2[numid]
    data_2 = data_1['data']
    price_overview = data_2['price_overview']
    final_formatted = price_overview['final_formatted']
    print('现价:'+Fore.CYAN+str(final_formatted))
    DB2 = float(Decimal(float(final_formatted.replace(country[countryid], '').replace(',', '.'))).quantize(Decimal('0.00')))

    if DB1 > DB2:
        print(str(DB1)+'>'+str(DB2)+'  可卖卡回本:'+Fore.GREEN+str(DB1-DB2))
    if DB1 < DB2:
        print(str(DB1)+'<'+str(DB2)+'  无回本:'+Fore.RED+str(DB1-DB2))


    main()



print('请选择:'+Fore.GREEN+'0 '+country[0]+' '+'1 '+country[1]+'\n')

countryid_run = input().replace(" ","")


try:
    countryid =  int(countryid_run)
    if(len(countryid_run)!=1):
            print('输入错误-默认为0')
            countryid=0

    int(countryid)
except ValueError:
        print('输入错误-默认为0')
        countryid = 0
        

main()
