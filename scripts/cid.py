import json

IMG_CID = 'QmY5FqZsjNUT5Zq5BgFCBt1L4uKf4uVRMS4dPRqMkhEm12'
NAME = 'AstarDegens #'
DESCRIPTION = 'AstarDegens Collection'
INPUT_FOLDER = './inputJson/'
PROCESS_NUM_OF_FILES = 2

class Cid():
    def __init__(self):
        self.numFiles = PROCESS_NUM_OF_FILES

    def getMetaFile(self, fileName):
        # Opening JSON file
        fp = open(fileName)
        metaData = json.load(fp)
        fp.close()
        return metaData

    def updateMeta(self, i, metaJson):
        metaJson['name'] = NAME + str(i)
        metaJson['description'] = DESCRIPTION
        metaJson['image'] = 'ipfs://' + IMG_CID + '/' + str(i) + '.png'
        return metaJson

    def execute(self):
        assert (self.numFiles >= 1)
        for i in range (1, self.numFiles+1):
            fullFileName = INPUT_FOLDER + str(i) + '.json'
            metaJson = self.getMetaFile(fullFileName)
            updatedMeta = self.updateMeta(i, metaJson)
            with open('./output/' + str(i) + '.json', 'w') as f:
                json.dump(updatedMeta, f, ensure_ascii = False, indent = 4)

if __name__ == "__main__":
    r = Cid()
    r.execute()

