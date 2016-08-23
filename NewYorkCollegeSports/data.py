import json
import csv

with open('sports_data.json', encoding='utf-8') as data_file:
    data = json.loads(data_file.read())
#print(data[0])

collegeList = []
for da in data:
    if da['college'] not in collegeList:
        collegeList.append(da['college'])

collegeDict = {}
for college in collegeList:
    resultsDict = {}
    resultsDict['sports'] = {}
    for da in data:
        if da['college'] is college:
            print(college in collegeDict)
            resultsDict['college_type'] = da['college_type']
            resultsDict['enrollment_female'] = da['enrollment_female']
            resultsDict['city'] = da['city']
            resultsDict['division_other'] = da['division_other']
            resultsDict['division'] = da['division']
            resultsDict['enrollment_total'] = da['enrollment_total']
            resultsDict['enrollment_male'] = da['enrollment_male']
            resultsDict['enrollment_female'] = da['enrollment_female']
    collegeDict[college] = resultsDict

with open('sports_data_single_sport.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        if row['college'] in collegeDict:
            row['expense_female'] = None if row['expense_female'] == '' else eval(row['expense_female'])
            row['expense_male'] = None if row['expense_male'] == '' else eval(row['expense_male'])
            print(type(row['expense_female']))
            collegeDict[row['college']]['sports'][row['sport']] = {'participants_male': row['participants_male'], 'participants_female': row['participants_female'],'revenue_male': row['revenue_male'], 'revenue_female': row['revenue_female'], 'exp_per_male_team': row['expense_male'], 'exp_per_female_team': row['expense_female'], 'exp_per_female': None if row['expense_female'] == None else int(row['expense_female'] / eval(row['participants_female'])), 'exp_per_male': None if row['expense_male'] == None else int(row['expense_male'] / eval(row['participants_male']))}

with open('clean_sports.json', 'w') as fp:
    json.dump(collegeDict, fp)
