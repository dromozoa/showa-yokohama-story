#! /bin/sh -e

here=`dirname "$0"`

integrated_loudness_target=$1
output_dirname=$2
shift 2

for i in "$@"
do
  output_name=`expr "X$i" : 'X\([^:]*\):'`
  source_dirname=`expr "X$i" : 'X[^:]*:\(.*\)'`
  env "LUA_PATH=$here/?.lua;;" lua "$here/convert_music.lua" "$integrated_loudness_target" "$output_dirname" "$output_name" "$source_dirname"/*.wav
done
