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
# import sys
import urllib
# import yaml
import re

TEMPLATE_TEXT = '''\
---
layout: archive
title: 第{id_}回 vimrc読書会
id: {id_}
category: archive
---
{{% include archive.md %}}
'''

END_MESSEAGE = '''\
=============
この後の手順
1. _data/next.yml を編集
2. jekyll serve -w -b /reading-vimrc/
3. http://localhost:4000/reading-vimrc/ を確認
4. git diff, git commit -vなどで確認した上で、commit & push
5. Wikiから今日読んだvimrcを削除
6. お疲れ様でした:)
============='''



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
        self.template_text = TEMPLATE_TEXT

    def setYamlInfo(self):
        # _data/archives.yml
        self.yml_path = os.path.join(self.ROOT_PATH, '_data', 'archives.yml')
        self.yml_txt = self.fetchYamlURL()
        # self.yml = self.convertText2Yaml(self.yml_txt)
        # self.id_ = self.yml[0]['id']
        self.id_ = int(re.search(r'(?<!^- id:)\d+(?<!$)', self.yml_txt).group(0))

    def setMDInfo(self):
        # archive/xxx.md
        self.archive_md = self.template_text.format(id_=str(self.id_))
        self.archive_path = os.path.join(self.ROOT_PATH, 'archive',
                                         str(self.id_).rjust(3, '0') + '.md')

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
    archive.setYamlInfo()
    if archive.id_ > 0:
        archive.appendYaml()
        print('_data/archives.ymlをアップデートしました')
    else:
        print('herokuが動いていない、またはyamlの情報が正しくないようです')
        archive.id_ = input('開催回数を入力してください: ')
        print('**_data/archives.ymlを手動で更新してください**')

    archive.setMDInfo()
    archive.addArchive()
    print('archive/{id_}.mdを生成しました'.format(
        id_=str(archive.id_).rjust(3, '0')))
    print(END_MESSEAGE)


if __name__ == '__main__':
    main()
