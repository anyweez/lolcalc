#!/bin/bash

python parseitems.py | python -m json.tool > data/items.json
