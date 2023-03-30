#! /bin/sh -e

# Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
#
# This file is part of 昭和横濱物語.
#
# 昭和横濱物語 is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# 昭和横濱物語 is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

prefix=$1
case X$prefix in
  X) echo "usage: $0 prefix"; exit 1;;
esac

start=`date "+%s"`

aws s3 ls --recursive "s3://vaporoid.com/$prefix" | awk '{print $4}' | while read i
do
  j="https://vaporoid.com/$i"
  echo "$j"
  curl --fail --output /dev/null --progress-bar "$j"
done

end=`date "+%s"`
elapsed=`expr "$end" - "$start" || :`

echo "elapsed: $elapsed sec"
