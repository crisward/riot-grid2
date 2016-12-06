<img src="https://cdn.rawgit.com/crisward/riot-grid2/master/grid-logo2.svg" height="140"/>

[![Build Status](https://travis-ci.org/crisward/riot-grid2.svg?branch=master)](https://travis-ci.org/crisward/riot-grid2)
[![Coverage Status](https://coveralls.io/repos/github/crisward/riot-grid2/badge.svg?branch=master&v=3)](https://coveralls.io/github/crisward/riot-grid2?branch=master)

[riot-grid](https://github.com/crisward/riot-grid) Version 2.
With new api and optimised for high column numbers.

`The version is for use with Riot.js v3.*`

Please see Riot2 branch for a riot v2 version

## Demo

Demo is available here - http://crisward.github.io/riot-grid2/

## Installing

```bash
npm install riot-grid2 --save-dev
```

## Usage

```html
<grid2 data="{data}" columns="{columns}" height="{700}" tabindex="1" click="{handleClick}"></grid2>
```

#### Attributes

|name       |Description
|------     |------
|data       |collection of data (array of objects)
|columns    |column description object (see below)
|height     |visible height of the grid, in pixels. 
|tabindex   |need to make the grid active for keyboard use
|click      |callback when a row is clicked. Returns an array of selected rows. Last element in the array is the last selected.


#### Columns

The `columns` attrubute is an object which describes the data.
The following keys can be used.

|name       |Type    | Required |Description
|------     |-----   |------    |------
|label	    |string  |yes       |The label which appears in the table header
|field	    |string  |yes       |The name of the field within your data object to display in this column
|width	    |int	 |yes       |Width in pixels of this column
|fixed	    |bool	 |no        |If this column should be fixed, or allowed to scroll horizontally 
|tag   	    |string  |no		|name of tag you would like to use in the column (see below)

Example

```javascript
var columns = [
    {label:'#',field:'id',width:50,fixed:true},
    {label:'name',field:"name1",width:120,fixed:true},
    {label:'name2',field:"name2",width:120},
    {label:"popularity",field:"popularity",width:200,tag:"image-cell"}
]
```

### Custom tags

Tags that are passed to the column reference will be passed the following attributes

|name       | Type  |Description
|------     |------ |------
|cell		|object |An object which decribed the grid cell. It containts the keys `left` `top` `width` `active` `tag` `text` `ridx` `col` ridx is the row index, col is the column information you defined in columns including any custom keys you add.
|val		|string |The value of the field passed in
|data       |array  |The data passed into the grid


Example

```html
<image-cell>
	<img src="{opts.value}" style="width:{opts.cell.width}px" />
</image-cell>
```


## About

Riot-grid helped to create grids with millions of rows, but slowed down dramatically with lots of colums.
Riot-grid2 is an attempt to resolve this limitation. 

It works by rendering individual cells, removing them from the dom or re-using them when they are no longer visible. Each cell is absolutelly positioned. Read on for a more details on how it acheives this.


#### Min Dom changes

**On first render**

* Go through all cells and add those which are in the visible area

**On scroll**

* Go through current cells and work out which ones should be removed
* Store the keys of these cells in an 'unused' array
* Go though all cells and find those which are current not visible but should be
* Add new cells into the unused slots
* If there are more new cells than unusued, add more (for grid resizes) 


## Features to add

### Keyboard
* down, select next, scroll to active
* up, select previous, scroll to active
* cmd+down, select next, in addition to last selected
* cmd+up, select previous, in addition to last selected
* shift click, select all between last select and clicked row

### General
* make header 'edges' draggable to resize columns (perhaps make optional)

### Callbacks
* on-dblclick - callback with array of selected rows and last double clicked row 

## License

(The MIT License)

Copyright (c) 2015 Cris Ward

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

