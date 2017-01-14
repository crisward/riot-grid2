datagen = require './mockdata'

griddata = datagen(1000)
gridheight = 500
require 'es5-shim' #needed for phantom js
window.riot = require 'riot'
require '../lib/grid2.js'
require './testtag.tag'
simulant = require 'simulant'

spyclick = null
columns = []
test = {}
rows = null

# id:i,first_name:randFirstname(),surname:randSurname(),age:randAge(),name:{first:randFirstname(),last:randSurname()}

columns = [
  {field:"id",label:"#",width:20,fixed:true,class:"identifier"}
  {field:"first_name",label:"First Name",width:100,class:["name", "first"]}
  {field:"surname",label:"Surname",width:100,class:"name sur"}
  {field:"age",label:"Age",width:100}
]

describe 'grid2',->

  beforeEach ->
    startTime = new Date().getTime()
    @domnode = document.createElement('div')
    @domnode.appendChild(document.createElement('testtag'))
    @node = document.body.appendChild(@domnode)
    spyclick = sinon.spy()
    @tag = riot.mount('testtag',{griddata:griddata,columns:columns,gridheight:gridheight,testclick:spyclick})[0]
    riot.update()
    rows = document.querySelectorAll('.gridrow')

  afterEach ->
    @tag.unmount()
    @domnode = ''

  it "should add grid to the document",->
    expect(document.querySelectorAll('testtag').length).to.equal(1)
    expect(document.querySelectorAll('grid2').length).to.equal(1)

  it "should load data into the grid",->
    expect(document.querySelectorAll('.cell').length).to.be.gt(1)
    expect(@node.textContent).to.contain(griddata[0].first_name)
    expect(@node.innerHTML).to.contain(griddata[0].surname)

  it "should set classes", ->
     expect(document.querySelectorAll('.headercell.identifier')[0].textContent).to.equal('#')
     expect(document.querySelectorAll('.headercell.name.first')[0].textContent).to.equal('First Name')
     expect(document.querySelectorAll('.headercell.name.sur')[0].textContent).to.equal('Surname')
     expect(document.querySelectorAll('.cell.identifier')[0].textContent.trim()).to.equal(griddata[0].id+"")
     expect(document.querySelectorAll('.cell.name.first')[0].textContent.trim()).to.equal(griddata[0].first_name)
     expect(document.querySelectorAll('.cell.name.sur')[0].textContent.trim()).to.equal(griddata[0].surname)

  it "should render only enough cells needed",->
     expect(document.querySelectorAll('.cell').length).to.be.lt((gridheight/40)*4)
     expect(document.querySelectorAll('.cell').length).to.be.gt((gridheight/40)*3)

  it "should render only enough rows after scrolling", (done)->
    document.querySelector('[ref=overlay]').scrollTop = 1000
    setTimeout =>
        expect(document.querySelectorAll('.cell').length).to.be.lt((gridheight/40)*4)
        expect(document.querySelectorAll('.cell').length).to.be.gt((gridheight/40)*3)
        done()
   
  it "should render only enough rows after scrolling (again)", (done) ->
    document.querySelector('.gridbody').scrollTop = 4380
    setTimeout =>
        expect(document.querySelectorAll('.cell').length).to.be.lt((gridheight/40)*4)
        expect(document.querySelectorAll('.cell').length).to.be.gt((gridheight/40)*3)
        done()
 
  it "should change class to active when cell is clicked",(done)->
    expect(@domnode.querySelectorAll('.active').length).to.equal(0)
    simulant.fire(document.querySelector('.cell'),'click')
    setTimeout =>
      expect(@domnode.querySelectorAll('.active').length).to.equal(columns.length)
      done()

  it "should only select one row at a time without meta key",(done)->
    expect(@domnode.querySelectorAll('.active').length).to.equal(0)
    simulant.fire(document.querySelector('.cell'),'click')
    setTimeout =>
      expect(@domnode.querySelectorAll('.active').length).to.equal(columns.length)
      simulant.fire(document.querySelectorAll('.cell')[12],'click')
      setTimeout =>
        expect(@domnode.querySelectorAll('.active').length).to.equal(columns.length)
        done()

  it "should toggle a row if clicked twice with meta key",(done)->
    expect(@domnode.querySelectorAll('.active').length).to.equal(0)
    simulant.fire(document.querySelectorAll('.cell')[5],'click',{metaKey:true})
    setTimeout =>
      expect(@domnode.querySelectorAll('.active').length).to.equal(columns.length)
      simulant.fire(document.querySelectorAll('.cell')[5],'click',{metaKey:true})
      setTimeout =>
        expect(@domnode.querySelectorAll('.active').length).to.equal(0)
        done()
 
  it "should call onclick on row when cell is clicked",(done)->
    simulant.fire(document.querySelector('.cell'),'click')
    setTimeout =>
      expect(spyclick.callCount).to.equal(1)
      expect(spyclick.args[0][0][0]).to.eql(griddata[0])
      done()

  it "should deselect row if meta-clicked",(done)->
    simulant.fire(document.querySelector('.cell'),'click')
    setTimeout =>
      expect(@domnode.querySelectorAll('.active').length).to.equal(columns.length)
      simulant.fire(document.querySelector('.cell'),'click',{metaKey:true})
      setTimeout =>
        expect(@domnode.querySelectorAll('.active').length).to.equal(0)
        done()

  it "should show custom tag with text value",->
    expect(@domnode.querySelectorAll('.testcell').length).to.equal(0)
    columns[1].tag = "testcell"
    @tag.unmount(true)
    @tag = riot.mount('testtag',{griddata:griddata,columns:columns,gridheight:gridheight,testclick:spyclick})[0]
    riot.update()
    expect(@domnode.querySelectorAll('.testcell').length).to.be.gt(1)
    expect(@domnode.querySelectorAll('.testcell')[0].textContent).to.equal(griddata[0].first_name)

  it "should show custom tag with object value",->
    expect(@domnode.querySelectorAll('.testcell-obj').length).to.equal(0)
    columns[1].tag = "testcell-obj"
    columns[1].field = "name"
    @tag.unmount(true)
    @tag = riot.mount('testtag',{griddata:griddata,columns:columns,gridheight:gridheight,testclick:spyclick})[0]
    riot.update()
    expect(@domnode.querySelectorAll('.testcell-obj').length).to.be.gt(1)
    expect(@domnode.querySelectorAll('.testcell-obj')[0].textContent).to.equal("#{griddata[0].name.last}, #{griddata[0].name.first}")

  it "should render correctly when changing columns",(done)->
    columns[1].tag = "testimage"
    columns[1].field = "image"
    data = {griddata:griddata,columns:columns,gridheight:gridheight,testclick:spyclick}
    @tag = riot.mount('testtag',data)[0]
    @tag.update()
    [0..10].forEach (num)=>
      expect(@domnode.querySelectorAll('.testimg')[num].getAttribute("src")).to.contain(griddata[num].image)
    @tag.opts.columns = data.columns.filter (rows,index)-> index != 2
    @tag.update()
    setTimeout =>
      [0..10].forEach (num)=>
        expect(@domnode.querySelectorAll('.testimg')[num].getAttribute("src")).to.contain(griddata[num].image)
      done()