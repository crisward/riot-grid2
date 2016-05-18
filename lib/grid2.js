
riot.tag2('grid2', '<div riot-style="height:{opts.height}px" class="gridwrap"> <div onscroll="{disableInteraction}" riot-style="overflow:auto;left:{fixedLeftWidth}px;top:{rowHeight}px;bottom:0px" class="gridbody"> <div riot-style="transform:translate3d({0-gridbody[1].scrollLeft}px,{0-gridbody[1].scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <div each="{visCells.main}" onclick="{handleClick}" no-reorder riot-style="position: absolute;left:{left}px;top:{top}px;width:{width}px;height:{rowHeight}px;" class="cell {active:active}">{text}</div> </div> </div> <div onscroll="{scrolling}" riot-style="overflow:auto;left:{fixedLeftWidth}px;top:{rowHeight}px;bottom:0px;pointer-events:{scrollAreaEvents};box-shadow:inset -10px -10px 0 0 rgba(255,255,255,1)" class="gridbody"> <div riot-style="background:rgba(0,0,0,0.05);width:{scrollWidth-fixedLeftWidth}px;height:{scrollHeight-rowHeight}px;" class="scrollArea"></div> </div> <div riot-style="height:{rowHeight}px;margin-right:15px" class="gridbody"> <div riot-style="top:0px;left:0px;width:{scrollWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.main}" no-reorder riot-style="transform:translate3d({left}px,0px,0px); backface-visibility: hidden;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> </div> <div riot-style="width:{fixedLeftWidth}px;height:{opts.height-2}px" class="gridbody"> <div riot-style="transform:translate3d(0px,{0-gridbody[1].scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <div riot-style="top:{gridbody[1].scrollTop}px;left:0px;width:{fixedLeftWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.fixed}" riot-style="top:0px;left:{left}px;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> <div each="{visCells.fixed}" onclick="{handleClick}" no-reorder riot-style="position: absolute;left:{left}px;top:{top}px;width:{width}px;height:{rowHeight}px;" class="cell {active:active}">{text} </div> </div> </div> </div>', 'grid2 { display: block; -webkit-font-smoothing: antialiased; text-rendering: optimizeSpeed; } grid2 .scrollArea { transform: translateZ(0); } grid2 .gridwrap { position: relative; display: block; border: 1px solid #ccc; font-family: sans-serif; font-size: 14px; } grid2 .gridbody { position: absolute; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; transform: translateZ(0); backface-visibility: hidden; } grid2 .fixedLeft { position: absolute; top: 0; bottom: 0; } grid2 .cell, grid2 .headercell { position: absolute; box-sizing: border-box; padding: 10px 5px; whitespace: no-wrap; overflow: hidden; background: #fff; border: 1px solid #eee; border-width: 0 1px 1px 0; cursor: pointer; } grid2 .cell.active { background: #eee; } grid2 .header { position: absolute; z-index: 1; overflow: hidden; transform: translateZ(0); }', '', function(opts) {
var calcArea, calcVisible, reCalc, reUse;

this.on('mount', function() {
  this.visCells = null;
  this.activeCells = [];
  this.activeRows = [];
  this.scrollWait = null;
  this.rowHeight = 40;
  this.scrollAreaEvents = "none";
  this.gridbody = this.root.querySelectorAll(".gridbody");
  this.update();
  this.gridbody[0].scrollTop = 10;
  return this.gridbody[0].scrollLeft = 10;
});

this.on('unmount', function() {
  if (this.scrollWait) {
    return clearTimeout(this.scrollWait);
  }
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

this.handleClick = (function(_this) {
  return function(e) {
    if (!e.metaKey) {
      _this.deselect();
    }
    if (e.metaKey) {
      return _this.toggleRow(e.item.ridx);
    } else {
      return _this.selectRow(e.item.ridx);
    }
  };
})(this);

this.toggleRow = (function(_this) {
  return function(ridx) {
    if (_this.activeRows.indexOf(ridx) > -1) {
      return _this.deselectRow(ridx);
    } else {
      return _this.selectRow(ridx);
    }
  };
})(this);

this.deselectRow = (function(_this) {
  return function(ridx) {
    _this.activeRows.splice(_this.activeRows.indexOf(ridx), 1);
    return _this.activeCells.forEach(function(cell) {
      if (cell.ridx === ridx) {
        return cell.active = false;
      }
    });
  };
})(this);

this.selectRow = (function(_this) {
  return function(ridx) {
    var cell, i, len, ref, results;
    _this.activeRows.push(ridx);
    ref = _this.rows[ridx].data;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      _this.activeCells.push(cell);
      results.push(cell.active = true);
    }
    return results;
  };
})(this);

this.deselect = (function(_this) {
  return function() {
    _this.activeCells.forEach(function(cell) {
      return cell.active = false;
    });
    _this.activeCells.length = 0;
    return _this.activeRows.length = 0;
  };
})(this);

this.disableInteraction = (function(_this) {
  return function(e) {
    e.target.scrollTop = 10;
    e.target.scrollLeft = 10;
    _this.scrollAreaEvents = "auto";
    return _this.cancelScroll();
  };
})(this);

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
          top: col.fixed ? top : top - _this.rowHeight + 10,
          left: col.fixed ? left : left - _this.fixedLeftWidth + 10,
          right: col.fixed ? col.width + left : col.width + left - _this.fixedLeftWidth,
          bottom: top + _this.rowHeight,
          width: col.width,
          text: row[col.field],
          fixed: col.fixed ? true : false,
          ridx: ridx,
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
    _this.cancelScroll();
    return _this.update();
  };
})(this);

this.cancelScroll = (function(_this) {
  return function() {
    clearTimeout(_this.scrollWait);
    return _this.scrollWait = setTimeout(function() {
      _this.scrollAreaEvents = "none";
      return _this.update();
    }, 200);
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