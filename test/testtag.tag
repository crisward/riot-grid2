testtag

  grid(data="{data}",tabindex="1",height="{height}",click="{handleSelect}",dblclick="{handleEdit}",onchange="{handleChange}")
    gridhead
      span(style="width:40%") First Name
      span(style="width:40%") Surname
      span(style="width:20%") Age
    gridbody
      span(style="width:40%") {row.first_name}
      span(style="width:40%") {row.surname}
      span(style="width:20%") {row.age}


  script(type="text/coffee").

    @on 'update',->
      @data = opts.griddata
      @height = opts.gridheight

    @handleSelect = (row)=>
      opts.testclick(row)

    @handleEdit = (row)=>
      opts.testclick2(row) 

    @handleChange = (rows)=>
      opts.testchange(rows)


testtag2

  grid(data="{data}",height="{height}",active="{activerow}")
    gridhead
      span(style="width:40%") First Name
      span(style="width:40%") Surname
      span(style="width:20%") Age
    gridbody
      span(style="width:40%") {row.first_name}
      span(style="width:40%") {row.surname}
      span(style="width:20%") {row.age}


  script(type="text/coffee").

    @on 'update',->
      @data = opts.griddata
      @height = opts.gridheight
      @activerow = opts.activerow

