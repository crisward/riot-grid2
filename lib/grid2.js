
riot.tag2('grid2', '<div riot-style="height:{opts.height}px" class="gridwrap"> <div riot-style="overflow:auto;left:{fixedLeftWidth}px;top:{rowHeight}px;bottom:0px" class="gridbody"> <div riot-style="transform:translate3d({0-gridbody[1].scrollLeft}px,{0-gridbody[1].scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <div each="{visCells.main}" no-reorder riot-style="position: absolute;left:{left}px;top:{top}px;width:{width}px;height:{rowHeight}px;" class="cell">{text}</div> </div> </div> <div onscroll="{scrolling}" riot-style="overflow:auto;left:{fixedLeftWidth}px;top:{rowHeight}px;bottom:0px" class="gridbody"> <div riot-style="background:rgba(0,0,0,0.1);width:{scrollWidth-fixedLeftWidth}px;height:{scrollHeight-rowHeight}px" class="scrollArea"></div> </div> <div riot-style="height:{rowHeight}px;padding-right:15px" class="gridbody"> <div riot-style="top:0px;left:0px;width:{scrollWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.main}" no-reorder riot-style="transform:translate3d({left}px,0px,0px); backface-visibility: hidden;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> </div> <div riot-style="width:{fixedLeftWidth}px;height:{opts.height-2}px" class="gridbody"> <div riot-style="transform:translate3d(0px,{0-gridbody[1].scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <div riot-style="top:{gridbody[1].scrollTop}px;left:0px;width:{fixedLeftWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.fixed}" riot-style="top:0px;left:{left}px;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> <div each="{visCells.fixed}" no-reorder riot-style="transform:translate3d({left}px,{top}px,0px);backface-visibility: hidden;width:{width}px;height:{rowHeight}px;" class="cell">{text} </div> </div> </div> </div>', 'grid2 { display: block; -webkit-font-smoothing: antialiased; text-rendering: optimizeSpeed; } grid2 .scrollArea { transform: translateZ(0); } grid2 .gridwrap { position: relative; display: block; border: 1px solid #ccc; font-family: sans-serif; font-size: 14px; } grid2 .gridbody { position: absolute; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; transform: translateZ(0); backface-visibility: hidden; } grid2 .fixedLeft { position: absolute; top: 0; bottom: 0; } grid2 .cell, grid2 .headercell { position: absolute; box-sizing: border-box; padding: 5px; whitespace: no-wrap; overflow: hidden; background: #fff; border: 1px solid #ccc; border-width: 0 1px 1px 0; } grid2 .header { position: absolute; z-index: 1; overflow: hidden; transform: translateZ(0); }', '', function(opts) {
var calcArea, calcVisible, reCalc, reUse;

this.rowHeight = 40;

this.on('mount', function() {
  this.visCells = null;
  this.gridbody = this.root.querySelectorAll(".gridbody");
  return this.update();
});

this.on('update', function() {
  if (!this.gridbody || !opts.data || !opts.columns) {
    return;
  }
  if (opts.columns && opts.data && (this.columns !== opts.columns || this.data !== opts.data)) {
    this.data = opts.data;
    this.columns = opts.columns;
    this.rows = [];
    this.calcPos();
    this.visCells = calcVisible(this.rows, this.gridbody[1], this.rowHeight);
  }
  if (!this.visCells) {
    return this.visCells = calcVisible(this.rows, this.gridbody[1], this.rowHeight);
  } else {
    return this.visCells = reCalc(this.visCells, this.rows, this.gridbody[1], this.rowHeight);
  }
});

this.calcPos = (function(_this) {
  return function() {
    var cidx, col, i, j, k, key, left, len, len1, len2, ref, ref1, ref2, ridx, row, top;
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
    ref = _this.columns;
    for (cidx = i = 0, len = ref.length; i < len; cidx = ++i) {
      col = ref[cidx];
      key = col.fixed ? "fixed" : "main";
      _this.headers[key].push({
        left: left,
        right: col.width + left,
        bottom: top + _this.rowHeight,
        width: col.width,
        text: col.label
      });
      left += col.width;
    }
    key = 0;
    ref1 = _this.data;
    for (ridx = j = 0, len1 = ref1.length; j < len1; ridx = ++j) {
      row = ref1[ridx];
      left = 0;
      top = (ridx + 1) * _this.rowHeight;
      _this.rows[ridx] = {
        data: []
      };
      ref2 = _this.columns;
      for (cidx = k = 0, len2 = ref2.length; k < len2; cidx = ++k) {
        col = ref2[cidx];
        _this.rows[ridx].data.push({
          top: col.fixed ? top : top - _this.rowHeight,
          left: col.fixed ? left : left - _this.fixedLeftWidth,
          right: col.fixed ? col.width + left : col.width + left - _this.fixedLeftWidth,
          bottom: top + _this.rowHeight,
          width: col.width,
          text: row[col.field],
          fixed: col.fixed ? true : false,
          key: key
        });
        key++;
        left += col.width;
      }
    }
    _this.scrollWidth = left;
    _this.scrollHeight = top + _this.rowHeight;
    return _this.update();
  };
})(this);

this.scrolling = (function(_this) {
  return function(e) {
    e.preventUpdate = true;
    _this.gridbody[2].scrollLeft = _this.gridbody[1].scrollLeft;
    return _this.update();
  };
})(this);

calcArea = function(gridbody) {
  return {
    top: gridbody.scrollTop,
    left: gridbody.scrollLeft,
    right: gridbody.scrollLeft + gridbody.offsetWidth,
    bottom: gridbody.scrollTop + gridbody.offsetHeight
  };
};

calcVisible = function(rows, gridbody, rowHeight) {
  var cells, first, i, idx, j, last, len, len1, r1, r2, ref, visible, visiblefixed, visrows;
  r1 = calcArea(gridbody);
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

reCalc = function(visCells, rows, gridbody, rowHeight) {
  var area, newcells;
  newcells = calcVisible(rows, gridbody, rowHeight);
  area = calcArea(gridbody);
  visCells.main = reUse(visCells.main, newcells.main, area);
  visCells.fixed = reUse(visCells.fixed, newcells.fixed, area);
  return visCells;
};

reUse = function(visible, newcells, area) {
  var cell, i, idx, j, len, len1, show, unused, viskeys;
  unused = [];
  viskeys = [];
  for (idx = i = 0, len = visible.length; i < len; idx = ++i) {
    cell = visible[idx];
    if (cell.left > area.right || cell.right < area.left || cell.bottom < area.top || cell.top > area.bottom) {
      unused.push(idx);
    } else {
      viskeys.push(cell.key);
    }
  }
  for (j = 0, len1 = newcells.length; j < len1; j++) {
    show = newcells[j];
    if (viskeys.indexOf(show.key) === -1) {
      if (unused.length > 0) {
        visible[unused.pop()] = show;
      } else {
        visible.push(show);
      }
    }
  }
  return visible;
};
});