import json

with open('clean_sports.json', encoding='utf-8') as data_file:
    data = json.loads(data_file.read())
print(len(data))

sportsDict = {}
for college in data:
    for sport in data[college]['sports']:
        #print(data[college]['sports'][sport])
        if sport not in sportsDict:
            sportsDict[sport] = ""
print(sportsDict)
for sport, college in sportsDict.items():
    print(sport)
    print(college)
    newList = []
    newList.append(college);
    for data_college in data:
        for data_sport in data[data_college]['sports']:
            if data_sport == sport and data_college not in newList:
                newList.append(data_college)
    sportsDict[sport] = newList
for sport,college in sportsDict.items():
    newCollege = college
    newCollege.pop(0)
    sportsDict[sport] = newCollege
print(sportsDict['Softball'])
print(len(sportsDict['Softball']))
#for sport in sportsDict.items():

#print(data['The College of Saint Rose']['sports'])
with open('sports.json', 'w') as fp:
    json.dump(sportsDict, fp)
