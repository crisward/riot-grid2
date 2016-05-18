# Riot Grid2

(potential successor to [riot-grid](https://github.com/crisward/riot-grid))

Trying to make it display millions of columns too.

I'm aiming to take a different approach. By absolutely positioning all the cells so they can be given 
specific behaviours.

## Demo

Early demo is available here - http://crisward.github.io/riot-grid2/


## Min Dom changes

#### On first render

* Go through all cells and add those which are in the visible area

#### on scroll

* Go through current cells and work out which ones should be removed
* Store the keys of these cells in an 'unused' array
* Go though all cells and find those which are current not visible but should be
* Add new cells into the unused slots
* If there are more new cells than unusued, add more (for grid resizes) 

## Known issues

* Mobile scrolling doesn't work well with the 'scroll overlay' technique
* columns mis-align when scroll all the way to the right (with visible scrollbars)

## License

(The MIT License)

Copyright (c) 2015 Cris Ward

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

