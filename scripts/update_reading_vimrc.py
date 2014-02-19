#!/usr/bin/env python
# -*- coding: utf-8 -*-
# FILE: /home/haya14busa/.vim_junk/2014/02/2014-02-19-134305.py
# AUTHOR: haya14busa
# License: MIT license
#
#     Permission is hereby granted, free of charge, to any person obtaining
#     a copy of this software and associated documentation files (the
#     "Software"), to deal in the Software without restriction, including
#     without limitation the rights to use, copy, modify, merge, publish,
#     distribute, sublicense, and/or sell copies of the Software, and to
#     permit persons to whom the Software is furnished to do so, subject to
#     the following conditions:
#
#     The above copyright notice and this permission notice shall be included
#     in all copies or substantial portions of the Software.
#
#     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
#     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
#     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
#     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
#     CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
#     TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
#     SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#
#=============================================================================

import os
import urllib
import yaml

VIMPLUGIN_YML_URL = 'http://lingr-bot-readingvimrc.herokuapp.com/reading_vimrc/vimplugin/yml'


def readFile(filename):
    f = open(filename, 'r')
    try:
        return f.read()
    finally:
        f.close()


def writeFile(filename, content):
    f = open(filename, 'w')
    try:
        f.write(content)
    finally:
        f.close()


def writeFileAppend(filename, content):
    f = open(filename, 'a')
    try:
        f.write(content)
    finally:
        f.close()


def readURL(url):
    f = urllib.urlopen(url)
    return f.read()


def getRootPath():
    '''
    ROOT_PATH/scripts/__file__
    '''
    return os.path.dirname(os.path.dirname(__file__))


def text2yaml(text):
    return yaml.load(text)


def main():
    # Get root path
    ROOT_PATH = getRootPath()

    # Get template text for next archives/\d\d\d.md
    template_file_path = os.path.join(
        ROOT_PATH, 'scripts', 'TEMPLATE_XXX_MD.md')
    TEMPLATE_XXX_MD = readFile(template_file_path)

    # Fetch yaml text of archive
    archive_txt = readURL(VIMPLUGIN_YML_URL)

    # Append archive info to _data/archives.yml
    archives_yml_path = os.path.join(ROOT_PATH, '_data', 'archives.yml')
    writeFileAppend(archives_yml_path, archive_txt)

    # Generate markdown text
    # Convert text to yaml and get archive_id
    archive_yml = text2yaml(archive_txt)
    archive_id = archive_yml[0]['id']
    archive_md = TEMPLATE_XXX_MD.format(id=str(archive_id))

    archive_md_path = os.path.join(ROOT_PATH, 'archive',
                                   str(archive_id).rjust(3, '0') + '.md')

    writeFile(archive_md_path, archive_md)


if __name__ == '__main__':
    main()
