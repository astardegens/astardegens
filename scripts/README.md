### List of all attributes added manually
    attributesDict.py
### Create dictionary of all possible changes (it uses attributesDict.py)
`python3 makeGeneratedDict > generatedDict.py` 

### Update/regenerate all traits according to generatedDict.py
`python3 updateTraits.py` 

### Make summary of all used attributes and count them
`python3 makeTraitSummary.py > summary.txt`

### Update name, cid, description in all files (if needed)
`python3 cid.py`