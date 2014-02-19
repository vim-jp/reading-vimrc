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
import sys
import urllib
import yaml


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
    ''' ROOT_PATH/scripts/__file__ '''
    return os.path.dirname(os.path.dirname(__file__))


def text2yaml(text):
    return yaml.load(text)


class VimrcArchive(object):
    def __init__(self):
        # Global Config
        self.ROOT_PATH = getRootPath()
        self.YAML_URL = 'http://lingr-bot-readingvimrc.herokuapp.com/reading_vimrc/vimplugin/yml'

        self.setYamlInfo()
        self.setMDInfo()

    def setYamlInfo(self):
        # _data/archives.yml
        self.yml_path = os.path.join(self.ROOT_PATH, '_data', 'archives.yml')
        self.yml_txt = self.fetchYamlURL()
        self.yml = self.convertText2Yaml(self.yml_txt)
        self._id = self.yml[0]['id']

    def setMDInfo(self):
        if not self._id:
            self.setYamlInfo()

        # archive/xxx.md
        self.template_path = os.path.join(self.ROOT_PATH, 'scripts',
                                          'TEMPLATE_XXX_MD.md')
        self.template_text = readFile(self.template_path)

        self.archive_md = self.template_text.format(id=str(self._id))
        self.archive_path = os.path.join(self.ROOT_PATH, 'archive',
                                         str(self._id).rjust(3, '0') + '.md')

    def fetchYamlURL(self):
        return readURL(self.YAML_URL)

    def convertText2Yaml(self, text):
        return text2yaml(text)

    def appendYaml(self):
        writeFileAppend(self.yml_path, self.yml_txt)

    def addArchive(self):
        writeFile(self.archive_path, self.archive_md)


def main():
    archive = VimrcArchive()
    if not archive._id > 0:
        print 'It seems heroku doesn\'t work correctly'
        # sys.exit()

    archive.appendYaml()
    archive.addArchive()


if __name__ == '__main__':
    main()
