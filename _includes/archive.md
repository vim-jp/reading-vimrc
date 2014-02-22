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
  {% when "San" %}(日)
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
