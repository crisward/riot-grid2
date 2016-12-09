
riot.tag2('grid2', '<div class="gridwrap" riot-style="height:{opts.height}px"> <div class="gridbody" ref="mainbody" riot-style="left:{fixedLeft.width}px;top:{rowHeight}px;bottom:0px"> <div class="fixedLeft" riot-style="transform:translate3d({fixedLeft.left}px,{fixedLeft.top}px,0px);backface-visibility: hidden;width:{fixedLeft.width}px;bottom:1px;z-index:2;"> <gridcelltag class="cell {cell.classes()}" tag="{cell.tag}" data="{parent.opts.data}" no-reorder val="{cell.text}" cell="{cell}" each="{cell in visCells.main}" onclick="{parent.handleClick}" riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{parent.rowHeight}px;">{cell.text}</gridcelltag> </div> </div> <div class="gridbody" ref="header" riot-style="height:{rowHeight}px;margin-right:15px"> <div class="header" riot-style="top:0px;left:0px;width:{scrollWidth}px;height:{rowHeight}px"> <div class="headercell {classes}" each="{headers.main}" no-reorder riot-style="transform:translate3d({left}px,0px,0px); backface-visibility: hidden;width:{width}px;height:{rowHeight}px;">{text}</div> </div> </div> <div class="gridbody" riot-style="width:{fixedLeft.width}px;height:{opts.height-2}px"> <div class="fixedLeft" riot-style="transform:translate3d(0px,{fixedLeft.top}px,0px);backface-visibility: hidden;width:{fixedLeft.width}px;bottom:1px;z-index:2;"> <div class="header" riot-style="top:{0 - fixedLeft.top}px;left:0px;width:{fixedLeft.width}px;height:{rowHeight}px"> <div class="headercell {classes}" each="{headers.fixed}" no-reorder riot-style="top:0px;left:{left}px;width:{width}px;height:{rowHeight}px;">{text}</div> </div> <gridcelltag class="cell {cell.classes()}" tag="{cell.tag}" no-reorder data="{parent.opts.data}" val="{cell.text}" cell="{cell}" each="{cell in visCells.fixed}" onclick="{parent.handleClick}" riot-style="position: absolute;left:{cell.left}px;top:{cell.top}px;width:{cell.width}px;height:{parent.rowHeight}px;">{cell.text}</gridcelltag> </div> </div> <div class="gridbody" ref="overlay" onscroll="{scrolling}" riot-style="overflow:auto;left:0px;top:{rowHeight}px;bottom:0px;-webkit-overflow-scrolling: touch;"> <div class="scrollArea" riot-style="background:rgba(0,0,0,0.005);width:{scrollWidth}px;height:{scrollHeight-rowHeight}px;"></div> </div> </div>', 'grid2 { display: block; -webkit-font-smoothing: antialiased; text-rendering: optimizeSpeed; } grid2 .scrollArea { transform: translateZ(0); } grid2 .gridwrap { position: relative; display: block; border: 1px solid #ccc; font-family: sans-serif; font-size: 14px; } grid2 .gridbody { position: absolute; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; transform: translateZ(0); backface-visibility: hidden; } grid2 .fixedLeft { position: absolute; top: 0; bottom: 0; } grid2 .cell, grid2 .headercell { position: absolute; box-sizing: border-box; padding: 10px 5px; whitespace: no-wrap; overflow: hidden; background: #fff; border: 1px solid #eee; border-width: 0 1px 1px 0; cursor: pointer; } grid2 .cell.active { background: #eee; } grid2 .header { position: absolute; z-index: 1; overflow: hidden; transform: translateZ(0); }', '', function(opts) {
var calcArea, calcPos, calcVisible, reCalc, reUse;

this.on('before-mount', function() {
  this.fixedLeft = {
    left: 0,
    top: 0,
    width: 0
  };
  this.headers = {
    fixed: [],
    main: []
  };
  this.visCells = {
    fixed: [],
    main: []
  };
  this.activeCells = [];
  this.activeRows = [];
  this.rows = [];
  return this.pushevents = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove'];
});

this.on('mount', function() {
  this.rowHeight = +opts.rowheight || 40;
  this.gridbody = this.root.querySelectorAll(".gridbody");
  this.pushevents.forEach((function(_this) {
    return function(eventname) {
      return _this.refs.overlay.addEventListener(eventname, _this.pushThroughEvent);
    };
  })(this));
  return this.update();
});

this.on('before-unmount', function() {
  return this.pushevents.forEach((function(_this) {
    return function(eventname) {
      return _this.refs.overlay.removeEventListener(eventname, _this.pushThroughEvent);
    };
  })(this));
});

this.on('update', function() {
  if (!this.gridbody || !opts.data || !opts.columns) {
    return;
  }
  if (this.refs.overlay) {
    this.fixedLeft.left = 0 - this.refs.overlay.scrollLeft;
    this.fixedLeft.top = 0 - this.refs.overlay.scrollTop;
  }
  if (opts.columns && opts.data && (this.columns !== opts.columns || this.data !== opts.data)) {
    this.data = opts.data;
    this.columns = opts.columns;
    this.rows = [];
    calcPos();
    this.visCells = calcVisible(this.rows, this.refs.overlay, this.rowHeight);
  }
  if (this.visCells.main.length === 0) {
    return this.visCells = calcVisible(this.rows, this.refs.overlay, this.rowHeight);
  } else {
    return this.visCells = reCalc(this.visCells, this.rows, this.refs.overlay, this.rowHeight);
  }
});

this.handleClick = (function(_this) {
  return function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.preventUpdate = true;
    if (!e.metaKey) {
      _this.deselect();
    }
    if (e.metaKey) {
      _this.toggleRow(e.item.cell.ridx);
    } else {
      _this.selectRow(e.item.cell.ridx);
    }
    return setTimeout(function() {
      return _this.update();
    });
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

this.pushThroughEvent = (function(_this) {
  return function(e) {
    var elem, event, top;
    e.stopPropagation();
    e.preventUpdate = true;
    top = _this.refs.overlay.scrollTop;
    try {
      event = new MouseEvent(e.type, e);
    } catch (error) {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(e.type, true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.target);
    }
    e.preventDefault();
    _this.refs.overlay.style.display = "none";
    elem = document.elementFromPoint(e.pageX, e.pageY);
    if (elem != null) {
      elem.dispatchEvent(event);
    }
    _this.refs.overlay.style.display = "block";
    return _this.refs.overlay.scrollTop = top;
  };
})(this);

calcPos = (function(_this) {
  return function() {
    var cidx, col, i, j, k, key, left, len, len1, len2, ref, ref1, ref2, ridx, row, top;
    left = 0;
    top = 0;
    _this.rows = [];
    _this.fixedLeft.width = _this.columns.filter(function(col) {
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
        tag: col.tag,
        classes: Array.isArray(col["class"]) ? col["class"].join(' ') : col["class"] || ""
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
          left: col.fixed ? left : left - _this.fixedLeft.width,
          right: col.fixed ? col.width + left : col.width + left - _this.fixedLeft.width,
          bottom: top + _this.rowHeight,
          width: col.width,
          text: row[col.field],
          tag: col.tag,
          fixed: col.fixed ? true : false,
          ridx: ridx,
          key: key,
          col: col,
          classes: function() {
            return (this.active ? "active " : "") + (Array.isArray(this.col["class"]) ? this.col["class"].join(' ') : this.col["class"] || "");
          }
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
    _this.refs.header.scrollLeft = _this.refs.overlay.scrollLeft;
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
riot.tag2('gridcelltag', '<div><yield></yield></div>', '', '', function(opts) {
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