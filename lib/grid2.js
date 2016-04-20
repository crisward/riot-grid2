
riot.tag2('grid2', '<div class="gridwrap"> <div onscroll="{scrolling}" riot-style="overflow:auto;left:{fixedLeftWidth}px;top:{rowHeight}px;" class="gridbody"> <div riot-style="width:{scrollWidth-fixedLeftWidth}px;height:{scrollHeight-rowHeight}px" class="scrollArea"> <div each="{visCells.main}" riot-style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="cell">{text}</div> </div> </div> <div riot-style="height:{rowHeight}px" class="gridbody"> <div riot-style="top:0px;left:{0-gridbody.scrollLeft}px;width:{scrollWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.main}" riot-style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="headercell">{text}</div> </div> </div> <div riot-style="width:{fixedLeftWidth}px;" class="gridbody"> <div riot-style="left:0px;top:{0-gridbody.scrollTop}px;width:{fixedLeftWidth}px;height:{scrollHeight}px;z-index:2;" class="fixedLeft"> <div riot-style="top:{gridbody.scrollTop}px;left:0px;width:{fixedLeftWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.fixed}" riot-style="top:0px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="headercell">{text}</div> </div> <div each="{visCells.fixed}" riot-style="top:{top}px;left:{left}px;width:{width}px;bottom:{bottom}px;" class="cell">{text} </div> </div> </div> </div>', '.gridwrap { position: relative; display: block; border: 1px solid #ccc; height: 800px; font-family: sans-serif; font-size: 14px; } .gridbody { position: absolute; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; } .fixedLeft { position: absolute; top: 0; bottom: 0; background: #eee; } .cell, .headercell { position: absolute; padding: 5px; } .header { position: absolute; background: #eee; z-index: 1; }', '', function(opts) {
var calcVisible, intersectRect;

this.rowHeight = 30;

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
  this.visCells = calcVisible(this.rows, this.gridbody, this.rowHeight);
  return console.timeEnd('calc');
});

this.calcPos = (function(_this) {
  return function() {
    var i, left, len, ref, ridx, row, top;
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
        bottom: top + _this.rowHeight,
        width: col.width,
        text: col.label
      });
      return left += col.width;
    });
    console.log('headers', _this.headers);
    ref = _this.data;
    for (ridx = i = 0, len = ref.length; i < len; ridx = ++i) {
      row = ref[ridx];
      left = 0;
      top = (ridx + 1) * _this.rowHeight;
      _this.rows[ridx] = {
        data: []
      };
      _this.columns.forEach(function(col, cidx) {
        _this.rows[ridx].data.push({
          top: col.fixed ? top : top - _this.rowHeight,
          left: col.fixed ? left : left - _this.fixedLeftWidth,
          right: col.fixed ? col.width + left : col.width + left - _this.fixedLeftWidth,
          bottom: top + _this.rowHeight,
          width: col.width,
          text: row[col.field],
          fixed: col.fixed ? true : false
        });
        return left += col.width;
      });
    }
    _this.scrollWidth = left;
    _this.scrollHeight = top + _this.rowHeight;
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

calcVisible = function(rows, gridbody, rowHeight) {
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