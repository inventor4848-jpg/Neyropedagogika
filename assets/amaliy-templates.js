function amaliyLoad(key) {
  try {
    return JSON.parse(localStorage.getItem('amaliy_' + key) || '{}');
  } catch (e) {
    return {};
  }
}

function amaliySave(key, data) {
  try {
    localStorage.setItem('amaliy_' + key, JSON.stringify(data));
  } catch (e) {}
}

function amaliyClear(key, containerId, renderFn) {
  if (!confirm("Kiritilgan ma'lumotlarni tozalashni tasdiqlaysizmi?")) return;
  try { localStorage.removeItem('amaliy_' + key); } catch (e) {}
  renderFn(containerId, key);
}

function amaliyToolbar(key, containerId, renderFn) {
  return (
    '<div class="tpl-toolbar">' +
    '<button type="button" class="tpl-btn tpl-btn-clear" onclick="amaliyClear(\'' + key + '\',\'' + containerId + '\',' + renderFn + ')">Tozalash</button>' +
    '<button type="button" class="tpl-btn" onclick="window.print()">Chop etish / PDF</button>' +
    '</div>'
  );
}

/* ---------- SWOT ---------- */
function renderSWOT(containerId, key) {
  var el = document.getElementById(containerId);
  var data = amaliyLoad(key);
  var quads = [
    { k: 'strengths', label: 'Kuchli tomonlar' },
    { k: 'weaknesses', label: 'Zaif tomonlar' },
    { k: 'opportunities', label: 'Imkoniyatlar' },
    { k: 'threats', label: 'Xavflar' }
  ];
  el.innerHTML =
    '<div class="tpl-swot-grid">' +
    quads.map(function (q) {
      return '<div class="tpl-swot-cell tpl-swot-' + q.k + '"><h5>' + q.label + '</h5>' +
        '<textarea data-field="' + q.k + '" placeholder="' + q.label + '...">' + (data[q.k] || '') + '</textarea></div>';
    }).join('') +
    '</div>' + amaliyToolbar(key, containerId, 'renderSWOT');
  el.querySelectorAll('textarea').forEach(function (ta) {
    ta.addEventListener('input', function () {
      var d = amaliyLoad(key);
      d[ta.dataset.field] = ta.value;
      amaliySave(key, d);
    });
  });
}

/* ---------- Mental xarita ---------- */
function renderMindMap(containerId, key) {
  var el = document.getElementById(containerId);
  var data = amaliyLoad(key);
  var branches = data.branches && data.branches.length ? data.branches : ['', '', ''];

  function paint() {
    el.innerHTML =
      '<div class="tpl-mindmap">' +
      '<div class="tpl-mindmap-center"><input type="text" placeholder="Markaziy tushuncha" value="' + (data.center || '').replace(/"/g, '&quot;') + '" data-center></div>' +
      '<div class="tpl-mindmap-branches">' +
      branches.map(function (b, i) {
        return '<div class="tpl-branch-row"><span class="tpl-branch-dot"></span><input type="text" placeholder="Tarmoq ' + (i + 1) + '" value="' + String(b).replace(/"/g, '&quot;') + '" data-branch="' + i + '">' +
          '<button type="button" class="tpl-branch-remove" aria-label="O\'chirish" data-remove="' + i + '">&times;</button></div>';
      }).join('') +
      '</div>' +
      '<button type="button" class="tpl-btn tpl-add-branch">+ Tarmoq qo\'shish</button>' +
      '</div>' + amaliyToolbar(key, containerId, 'renderMindMap');

    el.querySelector('[data-center]').addEventListener('input', function (e) {
      data.center = e.target.value;
      data.branches = branches;
      amaliySave(key, data);
    });
    el.querySelectorAll('[data-branch]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        branches[parseInt(inp.dataset.branch)] = inp.value;
        data.branches = branches;
        amaliySave(key, data);
      });
    });
    el.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        branches.splice(parseInt(btn.dataset.remove), 1);
        data.branches = branches;
        amaliySave(key, data);
        paint();
      });
    });
    el.querySelector('.tpl-add-branch').addEventListener('click', function () {
      branches.push('');
      paint();
    });
  }
  paint();
}

/* ---------- Kontseptual jadval ---------- */
function renderConceptTable(containerId, key) {
  var el = document.getElementById(containerId);
  var data = amaliyLoad(key);
  var rows = data.rows && data.rows.length ? data.rows : [['', ''], ['', ''], ['', '']];

  function paint() {
    el.innerHTML =
      '<table class="tpl-concept-table"><thead><tr><th>Tushuncha</th><th>Tavsif / misol</th><th></th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        return '<tr><td><input type="text" data-r="' + i + '" data-c="0" value="' + String(r[0]).replace(/"/g, '&quot;') + '"></td>' +
          '<td><input type="text" data-r="' + i + '" data-c="1" value="' + String(r[1]).replace(/"/g, '&quot;') + '"></td>' +
          '<td><button type="button" class="tpl-branch-remove" data-removerow="' + i + '">&times;</button></td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<button type="button" class="tpl-btn tpl-add-branch">+ Qator qo\'shish</button>' +
      amaliyToolbar(key, containerId, 'renderConceptTable');

    el.querySelectorAll('input[data-r]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        rows[parseInt(inp.dataset.r)][parseInt(inp.dataset.c)] = inp.value;
        data.rows = rows;
        amaliySave(key, data);
      });
    });
    el.querySelectorAll('[data-removerow]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        rows.splice(parseInt(btn.dataset.removerow), 1);
        data.rows = rows;
        amaliySave(key, data);
        paint();
      });
    });
    el.querySelector('.tpl-add-branch').addEventListener('click', function () {
      rows.push(['', '']);
      paint();
    });
  }
  paint();
}

/* ---------- Klaster ---------- */
function renderCluster(containerId, key) {
  var el = document.getElementById(containerId);
  var data = amaliyLoad(key);
  var tags = data.tags && data.tags.length ? data.tags : ['', '', ''];

  function paint() {
    el.innerHTML =
      '<div class="tpl-mindmap">' +
      '<div class="tpl-mindmap-center"><input type="text" placeholder="Markaziy so\'z" value="' + (data.center || '').replace(/"/g, '&quot;') + '" data-center></div>' +
      '<div class="tpl-cluster-tags">' +
      tags.map(function (t, i) {
        return '<div class="tpl-branch-row"><span class="tpl-branch-dot"></span><input type="text" placeholder="Tushuncha ' + (i + 1) + '" value="' + String(t).replace(/"/g, '&quot;') + '" data-tag="' + i + '">' +
          '<button type="button" class="tpl-branch-remove" data-remove="' + i + '">&times;</button></div>';
      }).join('') +
      '</div>' +
      '<button type="button" class="tpl-btn tpl-add-branch">+ Tushuncha qo\'shish</button>' +
      '</div>' + amaliyToolbar(key, containerId, 'renderCluster');

    el.querySelector('[data-center]').addEventListener('input', function (e) {
      data.center = e.target.value;
      data.tags = tags;
      amaliySave(key, data);
    });
    el.querySelectorAll('[data-tag]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        tags[parseInt(inp.dataset.tag)] = inp.value;
        data.tags = tags;
        amaliySave(key, data);
      });
    });
    el.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tags.splice(parseInt(btn.dataset.remove), 1);
        data.tags = tags;
        amaliySave(key, data);
        paint();
      });
    });
    el.querySelector('.tpl-add-branch').addEventListener('click', function () {
      tags.push('');
      paint();
    });
  }
  paint();
}

/* ---------- Mashg'ulotni loyihalash ---------- */
function renderLessonPlan(containerId, key) {
  var el = document.getElementById(containerId);
  var data = amaliyLoad(key);
  var fields = [
    { k: 'topic', label: 'Mavzu', type: 'input' },
    { k: 'goal', label: 'Maqsad', type: 'textarea' },
    { k: 'time', label: "Vaqt", type: 'input' },
    { k: 'stages', label: 'Bosqichlar', type: 'textarea' },
    { k: 'tools', label: 'Foydalaniladigan vositalar', type: 'textarea' },
    { k: 'assessment', label: 'Baholash', type: 'textarea' }
  ];
  el.innerHTML =
    '<div class="tpl-lesson-plan">' +
    fields.map(function (f) {
      var val = (data[f.k] || '').replace(/</g, '&lt;');
      return '<div class="tpl-field"><label>' + f.label + '</label>' +
        (f.type === 'input'
          ? '<input type="text" data-field="' + f.k + '" value="' + val.replace(/"/g, '&quot;') + '">'
          : '<textarea data-field="' + f.k + '">' + val + '</textarea>') +
        '</div>';
    }).join('') +
    '</div>' + amaliyToolbar(key, containerId, 'renderLessonPlan');

  el.querySelectorAll('[data-field]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var d = amaliyLoad(key);
      d[inp.dataset.field] = inp.value;
      amaliySave(key, d);
    });
  });
}

var AMALIY_RENDERERS = {
  swot: renderSWOT,
  mindmap: renderMindMap,
  concept: renderConceptTable,
  cluster: renderCluster,
  lessonplan: renderLessonPlan
};

function initAmaliyTemplate(method, containerId, key) {
  var fn = AMALIY_RENDERERS[method];
  if (fn) fn(containerId, key);
}
