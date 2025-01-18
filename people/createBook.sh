#!/usr/bin/env bash
PERSONTXT=${1?'missing person.txt'}
PERSON=$(tr -d .tx <<< $PERSONTXT)
PERSONPATH=text/$PERSON
[ -d $PERSONPATH ] || mkdir $PERSONPATH
awk '{print $1,$2;}' < person/$PERSONTXT | sed "s#'##g" > $PERSONPATH/coverparameters.txt
awk '{printf("../../getContentFromTagMetaDescription.sh %s > %s.txt\n", $3,$1);}' < person/$PERSONTXT > $PERSONPATH/raylex.sh
cd $PERSONPATH
bash raylex.sh
rm raylex.sh
