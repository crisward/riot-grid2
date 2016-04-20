
riot.tag2('grid2', '<div onscroll="{scrolling}" class="gridbody"> <div riot-style="left:{gridbody.scrollLeft}px;width:{fixedLeftWidth}px;height:{scrollHeight}px;background:white;z-index:2;" class="fixedLeft"> <div riot-style="top:{gridbody.scrollTop}px;left:0px;width:{fixedLeftWidth}px;" class="header"> <div each="{headers.fixed}" riot-style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="headercell">{text}</div> </div> <div each="{visCells.fixed}" riot-style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="cell">{text} </div> </div> <div riot-style="width:{scrollWidth}px;height:{scrollHeight}px" class="scrollArea"> <div riot-style="top:{gridbody.scrollTop}px;left:0px;width:{scrollWidth}px;" class="header"> <div each="{headers.main}" riot-style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="headercell">{text}</div> </div> <div each="{visCells.main}" riot-style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="cell">{text}</div> </div> </div>', '.gridbody { position: relative; display: block; border: 1px solid #ccc; height: 800px; overflow: auto; } .fixedLeft { position: absolute; top: 0; bottom: 0; } .cell, .headercell { position: absolute; } .header { position: absolute; background: #eee; height: 30px; z-index: 1; } .scrollArea { outline: 1px solid #00f; }', '', function(opts) {
var calcVisible, intersectRect, rowHeight;

rowHeight = 30;

this.on('mount', function() {
  this.data = opts.data;
  this.columns = opts.columns;
  this.gridbody = this.root.querySelector(".gridbody");
  this.rows = [];
  return this.calcPos();
});

this.on('update', function() {
  if (!this.gridbody) {
    return;
  }
  console.time('calc');
  this.visCells = calcVisible(this.rows, this.gridbody);
  return console.timeEnd('calc');
});

this.calcPos = (function(_this) {
  return function() {
    var left, top;
    left = 0;
    top = 0;
    _this.rows = [];
    _this.fixedLeftWidth = _this.columns.filter(function(col) {
      return col.fixed != null;
    }).reduce((function(a, col) {
      return a + col.width;
    }), 0);
    _this.headers = {
      fixed: [],
      main: []
    };
    left = 0;
    _this.columns.forEach(function(col, cidx) {
      var key;
      key = col.fixed ? "fixed" : "main";
      _this.headers[key].push({
        left: left,
        right: col.width + left,
        bottom: top + rowHeight,
        width: col.width,
        text: col.label
      });
      return left += col.width;
    });
    console.log('headers', _this.headers);
    _this.data.forEach(function(row, ridx) {
      left = 0;
      top = (ridx + 1) * rowHeight;
      _this.rows[ridx] = {
        data: []
      };
      return _this.columns.forEach(function(col, cidx) {
        _this.rows[ridx].data.push({
          top: top,
          left: left,
          right: col.width + left,
          bottom: top + rowHeight,
          width: col.width,
          text: row[col.field],
          fixed: col.fixed ? true : false
        });
        return left += col.width;
      });
    });
    _this.scrollWidth = left;
    _this.scrollHeight = top + rowHeight;
    return _this.update();
  };
})(this);

this.scrolling = (function(_this) {
  return function(e) {
    e.preventUpdate = true;
    return _this.update();
  };
})(this);

this.getClass = (function(_this) {
  return function(e) {
    return console.log(e.item);
  };
})(this);

calcVisible = function(rows, gridbody) {
  var cells, first, i, idx, j, last, len, len1, r1, r2, ref, visible, visiblefixed, visrows;
  r1 = {
    top: gridbody.scrollTop,
    left: gridbody.scrollLeft,
    right: gridbody.scrollLeft + gridbody.offsetWidth,
    bottom: gridbody.scrollTop + gridbody.offsetHeight
  };
  first = Math.max(Math.floor(r1.top / rowHeight), 0);
  last = Math.ceil(r1.bottom / rowHeight);
  visrows = rows.slice(first, last);
  visible = [];
  visiblefixed = [];
  for (i = 0, len = visrows.length; i < len; i++) {
    cells = visrows[i];
    ref = cells.data;
    for (idx = j = 0, len1 = ref.length; j < len1; idx = ++j) {
      r2 = ref[idx];
      if (r2.fixed) {
        visiblefixed.push(r2);
      } else if (!(r2.left > r1.right || r2.right < r1.left)) {
        visible.push(r2);
      }
      if (r2.left > r1.right) {
        break;
      }
    }
  }
  return {
    main: visible,
    fixed: visiblefixed
  };
};

intersectRect = function(r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left);
};
});