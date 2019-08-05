#!/bin/bash
#echo wow sctrew
rm -rf .backuppath
echo "$PATH" >> .backuppath

cd ../dev/bot-cli/bin
LOCAL_PATH=`pwd`
if [[ $PATH != *$LOCAL_PATH* ]]; then
	echo '\nexport PATH='$LOCAL_PATH':$PATH' >> ~/.bashrc
	echo 'export BOT_CLI='$LOCAL_PATH >> ~/.bashrc
	echo 'alias bot\ goto='
fi
echo 'sleep 1 && . ~/.bashrc'
echo The dev tools have been initialized, type \"bot help\" next if you want more information