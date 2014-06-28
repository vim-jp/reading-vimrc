#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'date'
require 'yaml'

puts 'All you need is Vim'

root = File::expand_path("#{File::dirname(__FILE__)}/..")
next_data_path = "#{root}/_data/next.yml"
next_data = YAML.load_file(next_data_path)

# Main
if !ARGV.empty?
  # Read URL
  # Support only GitHub right now
  next_vimrcs = ARGV.map {|url|
    url_path_split = url.split('/')
    {
      url: url,
      name: url_path_split[-1],
      author_name: url_path_split[3],
      author_url: url_path_split[0..3].join('/'),
    }
  }

  # Clone
  current_data = next_data
  next_data = Marshal.load(Marshal.dump(current_data))

  # first data
  f_current = current_data[0]
  f_next = next_data[0]

  f_next['id'] = f_current['id'] + 1
  f_next['date'] = (Date.parse(f_current['date']) + 7).to_s + " 23:00"

  # Update next vimrc
  f_next['vimrcs'] = next_vimrcs.map {|vimrc|
    {
      'url' => vimrc[:url],
      'name' => vimrc[:name],
      'hash' => nil, # TODO: consider hash
    }
  }

  f_next['author'] = {
    'name' => next_vimrcs[0][:author_name], # Assume same
    'url'  => next_vimrcs[0][:author_url],  # Assume same
  }

  # Others
  f_next['part'] = nil # Deal with parts
  f_next['other'] = nil

  # IO
  open(next_data_path, "wb") {|f|
    YAML.dump(next_data, f, indentation: 2)
  }
  puts 'Successfully updating next vimrc'
  puts 'Make sure the update is correct with git diff or whatever :)'
else
  puts "usage: #{File.basename(__FILE__)}"
  puts '--------'
  puts "./script/#{File.basename(__FILE__)} {next_vimrc_github_urls...}"
end
