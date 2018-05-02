---
layout: default
title: 過去の開催 - vimrc読書会
---

<table>
<thead>
<tr>
<th> ナンバー           </th>
<th> 日時                  </th>
<th> vimrc                                                                                                                     </th>
<th> ログ</th>
</tr>
</thead>
<tbody>
{% for archive in site.data.archives reversed %}
  {% if archive.id < 10 %}
    {% assign htmlname = archive.id | prepend: '00'  %}
  {% elsif archive.id < 100 %}
    {% assign htmlname = archive.id | prepend: '0' %}
  {% else %}
    {% assign htmlname = archive.id %}
  {% endif %}
  <tr>
    <td><a href="{{ htmlname }}.html">第{{ archive.id }}回</a></td>
    <td>
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
        {% endcase %}
      {{ archive.date | date: "%H:%M" }}-
    </td>
    <td>
    {% assign vimrc = archive.vimrcs[0] %}
    <a href="{{ vimrc.url }}">{{ archive.author.name }}</a> さん
      {% if archive.part %} ({{ archive.part }}) {% endif %}
    <br>
    </td>
    <td><a href="{{ archive.log }}">ログ</a></td>
  </tr>

{% endfor %}

</tbody>
</table>

[トップに戻る]({{ site.github.url | replace: 'http://', '//' }}/)

