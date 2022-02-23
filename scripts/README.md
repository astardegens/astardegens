list of all attributes manually
    attributesDict.py
python3 makeGeneratedDict > generatedDict.py (uses attributesDict)
    -> generatedDict.py
python3 updateTraits.py (uses generatedDict)
    -> json files

--- make summary of all attributes and count them
python3 makeTraitSummary.py

--- update name and description
python3 cid.py