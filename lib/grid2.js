
riot.tag2('grid2', '<div riot-style="height:{opts.height}px" class="gridwrap"> <div id="mainbody" riot-style="left:{fixedLeftWidth}px;top:{rowHeight}px;bottom:0px" class="gridbody"> <div riot-style="transform:translate3d({0-overlay.scrollLeft}px,{0-overlay.scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <gridcelltag tag="{cell.tag}" value="{cell.text}" cell="{cell}" each="{cell in visCells.main}" onclick="{handleClick}" no-reorder riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{rowHeight}px;" class="cell {active:cell.active}">{cell.text}</gridcelltag> </div> </div> <div id="header" riot-style="height:{rowHeight}px;margin-right:15px" class="gridbody"> <div riot-style="top:0px;left:0px;width:{scrollWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.main}" no-reorder riot-style="transform:translate3d({left}px,0px,0px); backface-visibility: hidden;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> </div> <div riot-style="width:{fixedLeftWidth}px;height:{opts.height-2}px" class="gridbody"> <div riot-style="transform:translate3d(0px,{0-overlay.scrollTop}px,0px);backface-visibility: hidden;width:{fixedLeftWidth}px;bottom:1px;z-index:2;" class="fixedLeft"> <div riot-style="top:{overlay.scrollTop}px;left:0px;width:{fixedLeftWidth}px;height:{rowHeight}px" class="header"> <div each="{headers.fixed}" riot-style="top:0px;left:{left}px;width:{width}px;height:{rowHeight}px;" class="headercell">{text}</div> </div> <gridcelltag tag="{cell.tag}" value="{cell.text}" cell="{cell}" each="{cell in visCells.fixed}" onclick="{handleClick}" no-reorder riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{rowHeight}px;" class="cell {active:cell.active}">{cell.text}</gridcelltag> </div> </div> <div id="overlay" onscroll="{scrolling}" riot-style="overflow:auto;left:0px;top:{rowHeight}px;bottom:0px;-webkit-overflow-scrolling: touch;" class="gridbody"> <div riot-style="background:rgba(0,0,0,0.005);width:{scrollWidth}px;height:{scrollHeight-rowHeight}px;" class="scrollArea"></div> </div> </div>', 'grid2 { display: block; -webkit-font-smoothing: antialiased; text-rendering: optimizeSpeed; } grid2 .scrollArea { transform: translateZ(0); } grid2 .gridwrap { position: relative; display: block; border: 1px solid #ccc; font-family: sans-serif; font-size: 14px; } grid2 .gridbody { position: absolute; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; transform: translateZ(0); backface-visibility: hidden; } grid2 .fixedLeft { position: absolute; top: 0; bottom: 0; } grid2 .cell, grid2 .headercell { position: absolute; box-sizing: border-box; padding: 10px 5px; whitespace: no-wrap; overflow: hidden; background: #fff; border: 1px solid #eee; border-width: 0 1px 1px 0; cursor: pointer; } grid2 .cell.active { background: #eee; } grid2 .header { position: absolute; z-index: 1; overflow: hidden; transform: translateZ(0); }', '', function(opts) {
var calcArea, calcPos, calcVisible, reCalc, reUse;

this.on('mount', function() {
  this.visCells = null;
  this.activeCells = [];
  this.activeRows = [];
  this.rowHeight = +opts.rowheight || 40;
  this.gridbody = this.root.querySelectorAll(".gridbody");
  this.update();
  this.overlay.addEventListener('click', this.pushThroughClick);
  return this.overlay.addEventListener('dlbclick', this.pushThroughClick);
});

this.on('unmount', function() {
  this.overlay.removeEventListener('click', this.pushThroughClick);
  return this.overlay.removeEventListener('dlbclick', this.pushThroughClick);
});

this.on('update', function() {
  if (!this.gridbody || !opts.data || !opts.columns) {
    return;
  }
  if (opts.columns && opts.data && (this.columns !== opts.columns || this.data !== opts.data)) {
    this.data = opts.data;
    this.columns = opts.columns;
    this.rows = [];
    calcPos();
    this.visCells = calcVisible(this.rows, this.overlay, this.rowHeight);
  }
  if (!this.visCells) {
    return this.visCells = calcVisible(this.rows, this.overlay, this.rowHeight);
  } else {
    return this.visCells = reCalc(this.visCells, this.rows, this.overlay, this.rowHeight);
  }
});

this.handleClick = (function(_this) {
  return function(e) {
    if (!e.metaKey) {
      _this.deselect();
    }
    if (e.metaKey) {
      return _this.toggleRow(e.item.cell.ridx);
    } else {
      return _this.selectRow(e.item.cell.ridx);
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
    if (opts.click) {
      opts.click(_this.activeRows.map(function(idx) {
        return opts.data[idx];
      }));
    }
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

this.pushThroughClick = (function(_this) {
  return function(e) {
    var elem, error, event;
    try {
      event = new MouseEvent(e.type, e);
    } catch (error) {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(e.type, e);
    }
    e.preventDefault();
    _this.overlay.style.display = "none";
    elem = document.elementFromPoint(e.pageX, e.pageY);
    elem.dispatchEvent(event);
    _this.overlay.style.display = "block";
    return _this.update();
  };
})(this);

calcPos = (function(_this) {
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
        text: col.label,
        tag: col.tag
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
          tag: col.tag,
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
    _this.header.scrollLeft = _this.overlay.scrollLeft;
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
  var cell, i, idx, j, len, len1, ref, show, tag, unused, viskeys;
  unused = {};
  viskeys = [];
  for (idx = i = 0, len = visible.length; i < len; idx = ++i) {
    cell = visible[idx];
    tag = cell.tag || "notag";
    if (cell.left > area.right || cell.right < area.left || cell.bottom < area.top || cell.top > area.bottom) {
      if (!unused[tag]) {
        unused[tag] = [];
      }
      unused[tag].push(idx);
    } else {
      viskeys.push(cell.key);
    }
  }
  for (j = 0, len1 = newcells.length; j < len1; j++) {
    show = newcells[j];
    if (viskeys.indexOf(show.key) === -1) {
      tag = show.tag || "notag";
      if (((ref = unused[tag]) != null ? ref.length : void 0) > 0) {
        visible[unused[tag].pop()] = show;
      } else {
        visible.push(show);
      }
    }
  }
  return visible;
};
});
riot.tag2('gridcelltag', '<div riot-tag="{opts.tag}"><yield></yield></div>', '', '', function(opts) {
this.prevtag = null;

this.on('mount', function() {
  if (!opts.tag) {
    return;
  }
  this.prevtag = opts.tag;
  return this.mountedTag = riot.mount(this.root.querySelector('div'), opts.tag, opts)[0];
});

this.on('update', function() {
  if (this.prevtag && this.prevtag !== opts.tag) {
    this.prevtag = opts.tag;
    this.mountedTag.unmount(true);
    return this.mountedTag = riot.mount(this.root.querySelector('div'), opts.tag, opts)[0];
  } else if (this.mountedTag) {
    this.mountedTag.opts = opts;
    return this.mountedTag.update();
  }
});

this.on('unmount', function() {
  if (this.mountedTag) {
    return this.mountedTag.unmount(true);
  }
});
});