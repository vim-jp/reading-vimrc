vimrc読書会まとめ
==================

http://vim-jp.org/reading-vimrc/


:memo: 更新手順
---------------

1. `$ ./scripts/update_reading_vimrc3.py`
  - python3ない場合は `./scripts/update_reading_vimrc.py`
2. `$ ./scripts/update_next_vimrc.rb {next_vimrc_github_urls...}`
3. 完了 :tada:


:book: Wiki更新手順(ローカル)
-----------------------------

1. `$ git clone https://github.com/vim-jp/reading-vimrc.wiki.git`
2. `$ ./update_wiki.rb`
  - 引数なしの場合一番最後に読んだvimrcがwikiから消える
3. `$ ./update_wiki.rb {next_vimrc_github_urls...}`
  - URLを与えた場合リクエストを追加
