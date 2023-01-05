#! /bin/sh -e

"$1" -y -r "$2" -i "$3" -vcodec libx264 -pix_fmt yuv420p -crf 18 "$4"
