from flask import Flask
import urllib2, PyPDF2, slate, re, os, json
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup, SoupStrainer

app = Flask(__name__)
CORS(app)

results = []

def parse_pdf(document):
    parsed = []
    result = []
    for page in document:
            result.append(page.split("\n")[8:])
    for i in result:
        for j in i:
            if re.findall('[A-Za-z0-9].*', j):
                parsed.append(j)
            else:
                continue
    for idx, entry in enumerate(parsed):
        if entry == "Reported:":
            temp_dict = {}
#           temp_dict['Reported_date'] = parsed[idx+1]
            temp_dict['Reported_time'] = parsed[idx+2]
        if entry == "Location:":
            if parsed[idx+2] != "Report #:":
                temp_dict['Location'] = parsed[idx+1]+parsed[idx+2]
            else:
                temp_dict['Location'] = parsed[idx+1]
        if entry == "Occurred:":
            temp_dict['Start_date'] = parsed[idx+1]
            temp_dict['Start_time'] = parsed[idx+2]
            temp_dict['End_date'] = parsed[idx+4]
            temp_dict['End_time'] = parsed[idx+5]
        if entry == "Incident:":
            temp_dict["Incident"] = parsed[idx+1]
        if "Summary" in entry:
            temp_dict["Summary"] = entry.split(":")[1]
            results.append(temp_dict)
    print "Hello"

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/data")
def parser():


    file_list = {}

    url = "https://dps.usc.edu/alerts/log/"
    page = urllib2.urlopen(url)
    for i in BeautifulSoup(page, parseOnlyThese=SoupStrainer('a')):
        if i.has_attr('href'):
             if "pdf" in i['href']:
                 file_list[i.text] = i['href']
    print file_list

    count = 0
    for date, file_name in file_list.iteritems():
        # if count == 10:
        #     break
        pdf_file = urllib2.urlopen(file_name)
        data = pdf_file.read()
        with open("report.pdf", "wb") as code:
            code.write(data)
        code.close()
        with open("report.pdf", 'rb') as f:
            pdf_text = slate.PDF(f)
        parse_pdf(pdf_text)
        os.remove("report.pdf")
        count = count +1
    print "Hello"
    to_send = json.dumps(results)
    return to_send

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
