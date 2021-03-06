grid2
  .gridwrap(style="height:{opts.height}px")
    //- scroll area
    .gridbody(ref="overlay",onscroll="{scrollbar}",riot-style="overflow:auto;left:{fixedLeft.width}px;top:{rowHeight}px;bottom:0px;-webkit-overflow-scrolling: touch;")
      div(if="{!measured}",style="height:100000px")
      .scrollArea(if="{measured}",riot-style="background:rgba(0,0,0,0.005);width:{scrollWidth-fixedLeft.width}px;height:{scrollHeight-rowHeight}px;")

    //- main body
    .gridbody(ref="mainbody",riot-style="left:{fixedLeft.width}px;top:{rowHeight}px;bottom:{scrollbarwidth}px;right:{scrollbarwidth}px")
      .fixedLeft(riot-style="transform:translate3d({fixedLeft.left}px,{fixedLeft.top}px,0px);backface-visibility: hidden;width:{fixedLeft.width}px;bottom:1px;z-index:2;")
        gridcelltag.cell(tag="{cell.tag}",data="{parent.opts.data}",class="{cell.classes()}",no-reorder,val="{cell.text}",cell="{cell}",each="{cell in visCells.main}",onclick="{parent.handleClick}",riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{parent.rowHeight}px;") {cell.text}
        
    //- fixed top
    .gridbody(ref="header",riot-style="height:{rowHeight}px;margin-right:15px")
      .header(riot-style="top:0px;left:0px;width:{scrollWidth}px;height:{rowHeight}px")
        .headercell(each="{headers.main}",no-reorder,riot-style="transform:translate3d({left}px,0px,0px); backface-visibility: hidden;width:{width}px;height:{rowHeight}px;",class="{classes}") {text}
    
    //- fixed left
    .gridbody(ref="fixedleft",riot-style="width:{fixedLeft.width}px;height:{opts.height-2}px")
      .fixedLeft(riot-style="transform:translate3d(0px,{fixedLeft.top}px,0px);backface-visibility: hidden;width:{fixedLeft.width}px;bottom:1px;z-index:2;")
        .header(riot-style="top:{0 - fixedLeft.top}px;left:0px;width:{fixedLeft.width}px;height:{rowHeight}px")
          .headercell(each="{headers.fixed}",no-reorder,riot-style="top:0px;left:{left}px;width:{width}px;height:{rowHeight}px;",class="{classes}") {text}
        gridcelltag.cell(tag="{cell.tag}",class="{cell.classes()}",no-reorder,data="{parent.opts.data}",val="{cell.text}",cell="{cell}",each="{cell in visCells.fixed}",onclick="{parent.handleClick}",riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{parent.rowHeight}px;") {cell.text}
  
  style(type="text/stylus"). 
    grid2
      display block
      -webkit-font-smoothing: antialiased
      text-rendering: optimizeSpeed
      .scrollArea
        transform: translateZ(0)
      .gridwrap
        position relative
        display block
        border 1px solid #ccc
        font-family sans-serif
        font-size:14px
      
      .gridbody
        position absolute
        overflow:hidden
        top 0
        left 0
        right 0
        bottom 0
        transform: translateZ(0)
        backface-visibility hidden
      
      .fixedLeft
        position absolute
        top 0
        bottom 0

      .cell,.headercell
        position absolute
        box-sizing border-box
        padding 10px 5px
        whitespace no-wrap
        overflow hidden
        background white
        border 1px solid #eee
        border-width 0 1px 1px 0
        cursor pointer
        
      .cell.active
        background #eee
        
      .header
        position absolute
        z-index 1
        overflow hidden
        transform: translateZ(0)
      
  script(type='text/coffee').

    @on 'before-mount',->
      @fixedLeft = {left:0,top:0,width:0}
      @headers = {fixed:[],main:[]}
      @visCells = {fixed:[],main:[]}
      @activeCells = []
      @activeRows = []
      @rows=[]
      @scrollevents = ['DOMMouseScroll','wheel','touchmove']
      @point = null
      @measured = false
      
    @on 'mount',->
      @rowHeight = +opts.rowheight || 40
      @gridbody = @root.querySelectorAll(".gridbody")
      @scrollevents.forEach (ev)=>
        @refs.mainbody.addEventListener(ev,@scrolling.bind(@,true,true),false)
        @refs.fixedleft.addEventListener(ev,@scrolling.bind(@,true,false),false)
      @refs.mainbody.addEventListener('touchstart',@scrollstart,false)
      @refs.fixedleft.addEventListener('touchstart',@scrollstart,false)
      @scrollbarwidth = @refs.overlay.offsetWidth - @refs.overlay.scrollWidth
      @measured = true
      @update()
      
    @on 'before-unmount',->
      @scrollevents.forEach (ev)=> 
        @refs.mainbody.removeEventListener(ev,@scrolling,false)
        @refs.fixedleft.removeEventListener(ev,@scrolling,false)
      @refs.mainbody.removeEventListener('touchstart',@scrollstart,false)
      @refs.fixedleft.removeEventListener('touchstart',@scrollstart,false)
 
    @on 'update',->
      return if !@gridbody || !opts.data || !opts.columns
      if @refs.overlay
        @fixedLeft.left = 0 - @refs.overlay.scrollLeft
        @fixedLeft.top = 0 - @refs.overlay.scrollTop
      if opts.columns && opts.data && (@columns != opts.columns || @data != opts.data)
        @data = opts.data
        @columns = opts.columns
        @rows=[]
        calcPos()
        # reset and update to issue #21
        if @visCells && ( @visCells.fixed.length || @visCells.main.length )
          @visCells = {fixed:[],main:[]}
          setTimeout => @update() 
          return      
        @visCells = calcVisible(@rows,@refs.overlay,@rowHeight)
      else if @visCells.main.length == 0
        @visCells = calcVisible(@rows,@refs.overlay,@rowHeight)
      else
        @visCells = reCalc(@visCells,@rows,@refs.overlay,@rowHeight)

    @handleClick = (e)=>
      e.preventDefault()
      e.stopPropagation()
      e.preventUpdate = true
      @deselect() if !e.metaKey
      if e.metaKey then @toggleRow(e.item.cell.ridx) else @selectRow(e.item.cell.ridx)
      setTimeout => @update()
    
    @toggleRow = (ridx)=>
      if @activeRows.indexOf(ridx)>-1 then  @deselectRow(ridx) else @selectRow(ridx)
       
    @deselectRow = (ridx)=>
      @activeRows.splice(@activeRows.indexOf(ridx),1)
      @activeCells.forEach (cell)-> if cell.ridx == ridx then cell.active = false 
    
    @selectRow = (ridx)=>
      @activeRows.push ridx
      if opts.click then opts.click @activeRows.map (idx)-> opts.data[idx]
      for cell in @rows[ridx].data
        @activeCells.push cell
        cell.active = true
    
    @deselect = =>
      @activeCells.forEach (cell)-> cell.active = false
      @activeCells.length = 0
      @activeRows.length = 0
         
    calcPos= => # work out co-ordinates of all cells
      left = 0
      top = 0
      @rows = []
      @fixedLeft.width = @columns.filter((col)-> col.fixed?).reduce ((a,col)-> a+col.width),0
      @headers = {fixed:[],main:[]}
      left = 0
      for col,cidx in @columns
        key = if col.fixed then "fixed" else "main"
        @headers[key].push
          left:left
          right:col.width+left
          bottom:top+@rowHeight
          width:col.width
          text:col.label
          tag:col.tag
          classes: if Array.isArray(col.class) then col.class.join(' ') else col.class || ""
        left+=col.width

      key = 0 #every cell has unique key
      for row,ridx in @data
        left = 0
        top = (ridx+1)*@rowHeight
        @rows[ridx]={data:[]}
        for col,cidx in @columns
          @rows[ridx].data.push
            top:if col.fixed then top else top-@rowHeight
            left: if col.fixed then left else left-@fixedLeft.width
            right:if col.fixed then col.width+left else col.width+left-@fixedLeft.width
            bottom:top+@rowHeight
            width:col.width
            text:row[col.field]
            tag:col.tag
            fixed:if col.fixed then true else false
            ridx:ridx
            key:key
            col:col
            classes: -> (if @active then "active " else "") + (if Array.isArray(@col.class) then @col.class.join(' ') else @col.class || "")
          key++
          left+=col.width
      @scrollWidth = left
      @scrollHeight = top+@rowHeight
      @update()
      
    @scrolling = (vert,horiz,e)=>
      e.preventUpdate = true
      e.preventDefault()
      if @point
        point2 = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}
        deltaX = @point.x - point2.x
        deltaY = @point.y - point2.y
        @point = point2
      else
        {deltaX,deltaY} = e
      @refs.overlay.scrollTop = @refs.overlay.scrollTop + deltaY if vert && deltaY != 0
      @refs.overlay.scrollLeft = @refs.overlay.scrollLeft + deltaX if horiz && deltaX != 0
      @refs.header.scrollLeft = @refs.overlay.scrollLeft
      @update()

    @scrollbar = (e)=>
      e.preventUpdate = true
      @refs.header.scrollLeft = @refs.overlay.scrollLeft
      @update() 

    @scrollstart = (e)=>
      @point = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}

    calcArea = (gridbody)->
      top:gridbody.scrollTop
      left:gridbody.scrollLeft
      right:gridbody.scrollLeft+gridbody.offsetWidth
      bottom:gridbody.scrollTop+gridbody.offsetHeight
            
    calcVisible=(rows,gridbody,rowHeight)->
      r1 = calcArea(gridbody)
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
    
    reCalc=(visCells,rows,gridbody,rowHeight)->
      newcells = calcVisible(rows,gridbody,rowHeight)
      area = calcArea(gridbody)
      # record unused
      visCells.main = reUse(visCells.main,newcells.main,area)
      visCells.fixed = reUse(visCells.fixed,newcells.fixed,area)
      return visCells
      
    reUse = (visible,newcells,area)->
      unused = {}
      viskeys = []
      for cell,idx in visible
        tag = cell.tag || "div"
        # if cell is outside of viewable area, push it onto an unused tag array
        if cell.left > area.right || cell.right < area.left || cell.bottom < area.top || cell.top > area.bottom
          unused[tag] = [] if !unused[tag]
          unused[tag].push idx
        else
        # if cell is in visible areaa keep on viskeys
          viskeys.push cell.key 
      for show in newcells
        if viskeys.indexOf(show.key) == -1 #if new cell us not on viskeys, try and reuse a tag
          tag = show.tag || "div"
          if unused[tag]?.length > 0 then visible[unused[tag].pop()] = show else visible.push(show)
      return visible
  

gridcelltag
  div(if="{!opts.tag}")
    <yield />
  div(if="{opts.tag}",data-is="{opts.tag}")
    <yield />

  script(type="coffee").
    @prevtag = null

    @on 'mount',->
      return if !opts.tag
      @prevtag = opts.tag
      @mountedTag = riot.mount(@root.querySelector('div'),opts.tag,opts)[0]

    @on 'update',->
      if @prevtag && @prevtag != opts.tag
        @prevtag = opts.tag
        @mountedTag.unmount(true)
        @mountedTag = riot.mount(@root.querySelector('div'),opts.tag,opts)[0]
      else if @mountedTag
        @mountedTag.opts = opts
        @mountedTag.update()

    @on 'unmount',->
      @mountedTag.unmount(true) if @mountedTag
