# -*- coding: utf-8 -*-
import sys, urllib, urllib2, json
import SimpleHTTPServer
SimpleHTTPServer.test()

url = 'http://apis.baidu.com/geekery/music/query?s=林依晨&limit=10&p=1'


req = urllib2.Request(url)

req.add_header("apikey", "751ecb0335b0a13344c465dd258313b9")

resp = urllib2.urlopen(req)
content = resp.read()
if(content):
    print(content)


