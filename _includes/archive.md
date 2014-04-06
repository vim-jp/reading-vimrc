{% for i in site.data.archives %}
  {% if i.id == page.id %}
    {% assign archive = i %}
  {% endif %}
{% endfor %}

### 日時
{% assign d = archive.date | date: "%a" %}
{{ archive.date | date: "%Y/%m/%d" }}
{% case d %}
  {% when "Mon" %}(月)
  {% when "Tue" %}(火)
  {% when "Wed" %}(水)
  {% when "Thu" %}(木)
  {% when "Fri" %}(金)
  {% when "Sat" %}(土)
  {% when "Sun" %}(日)
  {% else %}{{ d }}
  {% endcase %} {{ archive.date | date: "%H:%M" }}-


### vimrc
[{{ archive.author.name }}]({{ archive.author.url }}) さんの vimrc を読みました

<ul>
{% for vimrc in archive.vimrcs %}
  <li><a href="{{ vimrc.url }}">{{ vimrc.name }}</a>
      {% if vimrc.url contains 'github' %}
      (<a href="{{ vimrc.url | remove_first:'blob/' | replace:'https://github.com','https://raw.github.com' }}">ダウンロード
      </a>)
      {% endif %}
  </li>
{% endfor %}
</ul>

### 参加者リスト

{{ archive.members.size }} 名。

<ul>
{% for member in archive.members %}
  <li>{{ member }}</li>
{% endfor %}
</ul>

### ログ
<{{ archive.log }}>

### 関連リンク
{% for link in archive.links %}
  - <{{ link }}>
{% endfor %}

{% if archive.other %}
### その他
{{ archive.other }}
{% endif %}

<div id="archive-nav" style="margin-top: 50px; margin-bottom: 0px;">
{% assign prev_index = archive.id | minus: 2  %}
{% if site.data.archives[prev_index] and prev_index >= 0 %}
<span>
  {% assign prev_id = archive.id | minus: 1 %}
  {% if prev_id < 10 %}
    {% assign prev_html = prev_id | prepend: '00'  %}
  {% elsif prev_id < 100 %}
    {% assign prev_html = prev_id | prepend: '0' %}
  {% else %}
    {% assign prev_html = prev_id %}
  {% endif %}
  <a href="{{ prev_html }}.html">« 第{{ prev_id }}回</a>
</span>
{% endif %}

{% if site.data.archives[archive.id] %}
<span style="float: right;">
  {% assign next_id = archive.id | plus: 1 %}
  {% if next_id < 10 %}
    {% assign next_html = next_id | prepend: '00'  %}
  {% elsif next_id < 100 %}
    {% assign next_html = next_id | prepend: '0' %}
  {% else %}
    {% assign next_html = next_id %}
  {% endif %}
  <a href="{{ next_html }}.html">第{{ next_id }}回 »</a>
</span>
{% endif %}
</div>
