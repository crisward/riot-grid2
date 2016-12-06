testtag
  grid2(data="{data}",tabindex="1",height="{height}",click="{handleSelect}",columns="{columns}")
  
  script(type="text/coffee").

    @on 'update',->
      @data = opts.griddata
      @columns = opts.columns
      @height = opts.gridheight

    @handleSelect = (row)=>
      opts.testclick(row)

testcell
  div.testcell {opts.val}

testcell-obj
  div.testcell-obj {opts.val.last}, {opts.val.first}
