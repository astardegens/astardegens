from attributesDict import attributesDict

traitList = ['BACKGROUND', 'ATTIRE', 'BACKATTACHMENT', 'BODY', 'EYE', 'MOUTH', 'ACCESSORIES', 'EYEGLASSES', 'ARMOR', 'HAT']

print ("generatedDict = {\n")

for traitName in traitList:
    oldTraitName = traitName + '_OLD'
    # print(len(attributesDict[oldTraitName]))
    # print(len(attributesDict[traitName]))
    assert(len(attributesDict[oldTraitName]) == len(attributesDict[traitName]))
    result = dict()
    for ix, value in enumerate(attributesDict[oldTraitName]):
        result[value] = attributesDict[traitName][ix]

    print("'" + traitName + "': " )
    print(result)
    print (",")
print ("\n}")
