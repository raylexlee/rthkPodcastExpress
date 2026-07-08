#!/usr/bin/env bash
p=${1?'missing programmme name ...'}
python3 autocomplete_rthk_gen.py $p 0 $p
