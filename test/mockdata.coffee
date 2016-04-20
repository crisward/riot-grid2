module.exports = (count)->

  randAge = -> Math.round(Math.random()*110)+1
  randFirstname = ->
    names = ["Chloe","Emily","Megan","Charlotte","Jessica","Lauren","Sophie","Olivia","Hannah","Lucy","Georgia","Rebecca","Bethany","Amy","Ellie","Katie","Emma","Abigail","Molly","Grace","Courtney","Shannon","Caitlin","Eleanor","Jade","Ella","Leah","Alice","Holly","Laura","Anna","Jasmine","Sarah","Elizabeth","Amelia","Rachel","Amber","Phoebe","Natasha","Niamh","Zoe","Paige","Nicole","Abbie","Mia","Imogen","Lily","Alexandra","Chelsea","Daisy","Jack","Thomas","James","Joshua","Daniel","Harry","Samuel","Joseph","Matthew","Callum","Luke","William","Lewis","Oliver","Ryan","Benjamin","George","Liam","Jordan","Adam","Alexander","Jake","Connor","Cameron","Nathan","Kieran","Mohammed","Jamie","Jacob","Michael","Ben","Ethan","Charlie","Bradley","Brandon","Aaron","Max","Dylan","Kyle","Robert","Christopher","David","Edward","Charles","Owen","Louis","Alex","Joe","Rhyce"]
    names[Math.round(Math.random()*(names.length-1))]
  randSurname = ->
    names = ["Smith","Jones","Taylor","Williams","Brown","Davies","Evans","Wilson","Thomas","Roberts","Johnson","Lewis","Walker","Robinson","Wood","Thompson","White","Watson","Jackson","Wright","Green","Harris","Cooper","King","Lee","Martin","Clarke","James","Morgan","Hughes","Edwards","Hill","Moore","Clark","Harrison","Scott","Young","Morris","Hall","Ward","Turner","Carter","Phillips","Mitchell","Patel","Adams","Campbell","Anderson","Allen","Cook","Bailey","Parker","Miller","Davis","Murphy","Price","Bell","Baker","Griffiths","Kelly","Simpson","Marshall","Collins","Bennett","Cox","Richardson","Fox","Gray","Rose","Chapman","Hunt","Robertson","Shaw","Reynolds","Lloyd","Ellis","Richards","Russell","Wilkinson","Khan","Graham","Stewart","Reid","Murray","Powell","Palmer","Holmes","Rogers","Stevens","Walsh","Hunter","Thomson","Matthews","Ross","Owen","Mason","Knight","Kennedy","Butler","Saunders"]
    names[Math.round(Math.random()*(names.length-1))]

  griddata    = [0...count].map (i)-> {id:i,first_name:randFirstname(),surname:randSurname(),age:randAge()}

  return griddata