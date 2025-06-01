#!/bin/bash

if grep $GEMINI_API_KEY * ; then
	echo "ERROR cannot promot found $GEMINI_API_KEY in file." >> /dev/stderr
	exit 1;
else
	echo "Safe to promot did not find $GEMINI_API_KEY in any file."
	git add *.py *.sh *.md ;  git commit -m "promote latest artifacts"; git push origin main 
fi


