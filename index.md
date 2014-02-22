---
layout: default
title: vimrc読書会
---

<div class='next-vimrc'>
  {% assign next = site.data.next[0] %}
  <h3>次回予告</h3>
  <ul>
    <li>第{{ next.id }}回</li>
    {% assign d = next.date | date: "%a" %}
    <li>日時: <span class='date'>
                {{ next.date | date: "%Y/%m/%d " }}
                {% case d %}
                  {% when "Mon" %}(月)
                  {% when "Tue" %}(火)
                  {% when "Wed" %}(水)
                  {% when "Thu" %}(木)
                  {% when "Fri" %}(金)
                  {% when "Sat" %}(土)
                  {% when "San" %}(日)
                  {% else %}{{ d }}
                  {% endcase %}
                {{ next.date | date: " %H:%M" }}
              </span>
    </li>
    <li>場所: <a href="http://lingr.com/room/vim">LingrのVim部屋</a></li>
    <li>vimrc: <a href="{{ next.author.url }}"> {{ next.author.name }}</a> さん
        {% if next.part %} ({{ next.part }}) {% endif %}
    </li>
      <ul>
        {% for vimrc in next.vimrcs %}
           <li><a href="{{ vimrc.url }}">{{ vimrc.name }}</a></li>
        {% endfor %}
      </ul>
  </ul>
  {% if next.other %}
    <p>{{ next.other }}</p>
  {% endif %}

  <p>※更新が遅れる場合、過去のものが掲載されている可能性があります。</p>
</div>

### vimrc読書会とは
オンラインで集まり、毎回みんなで特定の誰かの vimrc を読んで、気になるところやわからないところ、感心するところなどを好き勝手に言いあう集まりです。

### 目的
他の人の vimrc を読むことで、便利な設定を共有したり、便利なプラグインを発掘したり、Vim script に対する理解を深めたりします。
また、時には自身の vimrc を読んでもらうことで、vimrc の問題点を発見し、vimrc を洗練させます。コードレビューと同等の効果が期待できます。

### 開催概要
- 日時: 毎週土曜日夜23時(JST)
- 場所: オンラインのチャットルーム [Lingr の Vim 部屋](http://lingr.com/room/vim)

発言するには Lingr のアカウントを取得する必要があります。ログを読みたいだけならその必要はありません(各過去の開催ページにログへのリンクがあります)。
終了時間は特に決まっていませんが、毎回だいたい2時間くらいです。ただし、後述の通り途中参加/途中離脱OKです。

### おやくそく

- 途中参加/途中離脱OK。特に声をかける必要はないです
- 読む順はとくに決めないので、好きなように読んで好きなように発言しましょう
- vimrc 内の特定位置を参照する場合は行番号で L100 のように指定します
- 特定の相手に発言/返事する場合は先頭に username: を付けます
- 一通り読み終わったら、読み終わったことを宣言してください。終了の目安にします
  - ただの目安なので、宣言してからでも読み返して全然OKです

### リクエスト
- [読みたいvimrcリクエスト](https://github.com/vim-jp/reading-vimrc/wiki/Request)

今後読んでみたい vimrc を上記の wiki で追加する事ができます。
もし、読んでみたい vimrc があったらぜひ上記の wiki に追加してください！

### 読まれることになった方へ
本会では、広く公開されている vimrc の中から読む vimrc を勝手に選んで読んでいます。公開されているものは読まれても問題ないものであると考え、一定の手間を避けるために、基本的に vimrc の持ち主に連絡を行うことはありません。

ただし、もしあなたの vimrc が読まれることになり、かつ都合が悪い場合は、お手数ですが運営メンバーへご連絡ください。善処したいと思います。

例:

- 読まれたくない！やめろ！
  - 読むのを控えさせていただきます。ご迷惑をおかけしました。
- リクエストページに自分のが追加されているけど、読まれたくない…
  - 読まないよう印を付けさせていただきます(再追加を避けるために、削除はしません)
- 自分のが読まれるなら参加したいけど、その日は都合が悪い…
  - 読む日を改めさせてもらいたいと思います。ご都合の良い日を教えてください。


### 過去の開催
[過去の開催はこちら](archive/index.html)

### 運営
主に開催の日程を決めたり、vimrc を探してきたり、当日の進行(と言っても開始と終了の合図をするくらい)をする人たちです。

- [thinca](https://github.com/thinca) (Twitter: [@thinca](https://twitter.com/thinca))
- [osyo-manga](https://github.com/osyo-manga) (Twitter: [@manga_osyo](https://twitter.com/manga_osyo))
- [LeafCage](https://github.com/LeafCage) (Twitter: [@LeafCage](https://twitter.com/LeafCage))
- [rbtnn](https://github.com/rbtnn) (Twitter: [@rbtnn](https://twitter.com/rbtnn))
- [deris](https://github.com/deris) (Twitter: [@deris0126](https://twitter.com/deris0126))

運営者はいつでも募集中です。お気軽に声をかけてください！

