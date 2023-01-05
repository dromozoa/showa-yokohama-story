#! /bin/sh -e

ffmpeg=`pwd`/ffmpeg

prefix=$1
shift

for i in "$@"
do
  j=`basename "$i"`
  j=`expr "X$j" : 'X\([0-9]*\)'`
  j="$prefix$j"

  "$ffmpeg" -y -i "$i" "$j.ogg"
  "$ffmpeg" -y -i "$i" "$j.m4a"
done
