grid2
  .gridbody(onscroll='{scrolling}')
    .fixedLeft(style="left:{gridbody.scrollLeft}px;width:{fixedLeftWidth}px;height:{scrollHeight}px;background:white;z-index:2;")
      .header(style="top:{gridbody.scrollTop}px;left:0px;width:{fixedLeftWidth}px;")
        .headercell(each="{headers.fixed}",style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;") {text}
      .cell(each="{visCells.fixed}",style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;") {text} 
    .scrollArea(style="width:{scrollWidth}px;height:{scrollHeight}px")
      .header(style="top:{gridbody.scrollTop}px;left:0px;width:{scrollWidth}px;")
        .headercell(each="{headers.main}",style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;") {text}
      .cell(each="{visCells.main}",style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;") {text}
  
  style(type="text/stylus").
    .gridbody
      position relative
      display block
      border 1px solid #ccc
      height:800px
      overflow:auto
    .fixedLeft
      position absolute
      top 0
      bottom 0
    .cell,.headercell
      position absolute
    .header
      position absolute
      background #eee
      height 30px
      z-index 1
      

    .scrollArea
      outline:1px solid blue

  script(type='text/coffee').
    rowHeight = 30
    
    @on 'mount',->
      @data = opts.data
      @columns = opts.columns
      @gridbody = @root.querySelector(".gridbody")
      @rows=[]
      @calcPos()

    @on 'update',->
      return if !@gridbody
      console.time('calc')
      @visCells = calcVisible(@rows,@gridbody)
      console.timeEnd('calc')

    @calcPos= =>
      # work out co-ordinates of all cells
      left = 0
      top = 0
      @rows = []
      @fixedLeftWidth = @columns.filter((col)-> col.fixed?).reduce ((a,col)-> a+col.width),0
      @headers = {fixed:[],main:[]}
      left = 0
      @columns.forEach (col,cidx)=>
        key = if col.fixed then "fixed" else "main"
        @headers[key].push
          left:left
          right:col.width+left
          bottom:top+rowHeight
          width:col.width
          text:col.label
        left+=col.width
      console.log 'headers',@headers
      
      @data.forEach (row,ridx)=>
        left = 0
        top = (ridx+1)*rowHeight
        @rows[ridx]={data:[]}
        @columns.forEach (col,cidx)=>
          @rows[ridx].data.push
            top:top
            left:left
            right:col.width+left
            bottom:top+rowHeight
            width:col.width
            text:row[col.field]
            fixed:if col.fixed then true else false
          left+=col.width
      @scrollWidth = left
      @scrollHeight = top+rowHeight
      @update()
      
    @scrolling = (e)=>
      e.preventUpdate = true
      @update()
      
    @getClass = (e)=>
      console.log e.item
      
    calcVisible=(rows,gridbody)->
      #a quick way of determining which cells are visible
      r1 =
        top:gridbody.scrollTop
        left:gridbody.scrollLeft
        right:gridbody.scrollLeft+gridbody.offsetWidth
        bottom:gridbody.scrollTop+gridbody.offsetHeight
      first = Math.max(Math.floor(r1.top / rowHeight),0)
      last = Math.ceil(r1.bottom / rowHeight)
      visrows = rows.slice(first,last)
      visible = []
      visiblefixed = []
      for cells in visrows
        for r2,idx in cells.data
          if r2.fixed
            visiblefixed.push r2
          else if !(r2.left > r1.right || r2.right < r1.left)
            visible.push r2
          break if r2.left > r1.right
          
      return {main:visible,fixed:visiblefixed}

    intersectRect = (r1, r2)->
      return !(r2.left > r1.right || r2.right < r1.left)
