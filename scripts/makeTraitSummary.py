import json
PROCESS_NUM_OF_FILES = 10000
# INPUT_FOLDER = './inputTestJson/'
INPUT_FOLDER = './output-02-23/'

class TraitSummary():
    def __init__(self):
        self.numFiles = PROCESS_NUM_OF_FILES
        self.trait_summary = dict()
        self.trait_summary = {'BACKGROUND': 0, 'ATTIRE': 0, 'BACKATTACHMENT': 0, 'BODY': 0, 'EYE': 0, 'MOUTH': 0, 'ACCESSORIES': 0, 'EYEGLASSES': 0, 'ARMOR': 0, 'HAT': 0}
        self.trait_value = {'BACKGROUND': dict(), 'ATTIRE': dict(), 'BACKATTACHMENT': dict(), 
        'BODY': dict(), 'EYE': dict(), 'MOUTH': dict(), 'ACCESSORIES': dict(), 'EYEGLASSES': dict(), 'ARMOR': dict(), 'HAT': dict()}

    def getMetaFile(self, fileName):
        # Opening JSON file
        fp = open(fileName)
        metaData = json.load(fp)
        fp.close()
        return metaData

    def getTraitsCnt(self, i, metaJson):
        for trait in metaJson['attributes']:
            t = trait['trait_type']
            self.trait_summary[t] += 1

    def getTraitsValues(self, i, metaJson):
        for trait in metaJson['attributes']:
            traitType = trait['trait_type']
            new_value = trait['value']
            # currentList = self.trait_value[traitType]
            # currentList.append(new_value)
            if new_value in self.trait_value[traitType]:
                self.trait_value[traitType][new_value] += 1
            else:
                self.trait_value[traitType][new_value] = 1
    
    def printSetOfValues(self):
        for trait_type in self.trait_value:
            print("\n########## " + trait_type + " ##########")
            print(self.trait_value[trait_type])
            # print(set(self.trait_value[trait_type]))

    def execute(self):
        assert (self.numFiles >= 1)
        for i in range (1, self.numFiles+1):
            fullFileName = INPUT_FOLDER + str(i) + '.json'
            metaJson = self.getMetaFile(fullFileName)
            self.getTraitsCnt(i, metaJson)
            self.getTraitsValues(i, metaJson)
        # print(self.trait_summary)
        self.printSetOfValues()

if __name__ == "__main__":
    r = TraitSummary()
    r.execute()

