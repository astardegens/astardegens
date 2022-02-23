import json
from generatedDict import generatedDict

PROCESS_NUM_OF_FILES = 10000
# INPUT_FOLDER = './inputTestJson/'
INPUT_FOLDER = '../json_v1/'
OUTPUT_FOLDER = './outputAll/'

class UpdateTraits():
    def __init__(self):
        self.numFiles = PROCESS_NUM_OF_FILES
        self.trait_summary = dict()
        # self.traitList = ['BACKGROUND', 'BACKATTACHMENT', 'BODY', 'EYE', 'ATTIRE', 'ACCESSORIES',  'MOUTH', 'EYEGLASSES', 'HAT', 'ARMOR']

    def getMetaFile(self, fileName):
        # Opening JSON file
        fp = open(fileName)
        metaData = json.load(fp)
        fp.close()
        return metaData

    def findIndex(self, traitList, traitName):
        for ix, trait in enumerate(traitList):
            if trait['trait_type'] == traitName:
                # print('Found index for ' + traitName)
                return ix
        assert(False)

    def updateTraitsValues(self, i, metaJson):
        # print('Updating file ' + str(i))
        for trait in metaJson['attributes']:
            traitName = trait['trait_type']
            ix = self.findIndex(metaJson['attributes'], traitName)
            oldValue = trait['value']
            newValue = generatedDict[traitName][oldValue]
            metaJson['attributes'][ix]['value'] = newValue
            # print( 'replacing ' + oldValue + ' with ' + newValue)
        return metaJson


    def execute(self):
        assert (self.numFiles >= 1)
        for i in range (1, self.numFiles+1):
            fullFileName = INPUT_FOLDER + str(i) + '.json'
            metaJson = self.getMetaFile(fullFileName)
            updatedMeta = self.updateTraitsValues(i, metaJson)
            with open(OUTPUT_FOLDER + str(i) + '.json', 'w') as f:
                json.dump(updatedMeta, f, ensure_ascii = False, indent = 4)
        print("processed files:" + str(i))


if __name__ == "__main__":
    r = UpdateTraits()
    r.execute()

