/* Preview controls only; this file is not part of the installed theme. */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const journalMarkup = $('#reading-pane').innerHTML;
const notes = {
  journal: {
    title: '夜行手记',
    outline: ['壹 · 雨夜行旅', '贰 · 案头线索', '启程之前', '一段心法'],
    markup: journalMarkup
  },
  weapons: {
    title: '兵器谱',
    outline: ['壹 · 藏锋', '贰 · 记事', '收录清单', '案头一行'],
    markup: `<div class="note-eyebrow"><span>藏锋录</span><span>卷二 / THE ARSENAL</span></div>
      <div class="inline-title">兵器谱</div>
      <p class="opening">器有形，意无穷。</p>
      <p>这是主题的第二篇示例笔记。锋芒藏于鞘，章法见于字。用简洁的层次，整理复杂的思考。</p>
      <h2 id="section-travel">壹 · 藏锋</h2><blockquote><p>手中有刃，笔下有度。</p></blockquote>
      <p>字里行间的重点，用<strong>粗体</strong>留下分量；引文的余韵，交给<em>冷青色的斜体</em>。</p>
      <h2 id="section-clues">贰 · 记事</h2>
      <table><thead><tr><th>类别</th><th>笔记方式</th><th>用途</th></tr></thead><tbody><tr><td>长卷</td><td>连续书写</td><td>整理思路</td></tr><tr><td>短札</td><td>随手摘记</td><td>保存灵感</td></tr><tr><td>索引</td><td>双向链接</td><td>连接知识</td></tr></tbody></table>
      <h3 id="section-tasks">收录清单</h3><ul class="contains-task-list"><li class="task-list-item"><label><input type="checkbox" class="task-list-item-checkbox">写下今天的一点新知</label></li></ul>
      <h3 id="section-code">案头一行</h3><p>以 <code>[[夜行手记]]</code> 作为新的起点。</p><hr><p class="note-end">锋芒在字外，功夫在行间。</p>`
  },
  palette: {
    title: '墨影与赤金',
    outline: ['壹 · 墨夜', '贰 · 宣纸', '阅读的分寸', '离线可用'],
    markup: `<div class="note-eyebrow"><span>观色札记</span><span>卷三 / THE PALETTE</span></div>
      <div class="inline-title">墨影与赤金</div><p class="opening">五色成境，留白成卷。</p>
      <p>墨刃的颜色取意于暗黑武侠的雨夜、旧金属与灯火。以下是设计配色，并非游戏官方色板。</p>
      <h2 id="section-travel">壹 · 墨夜</h2>
      <table><thead><tr><th>色名</th><th>色值</th><th>用途</th></tr></thead><tbody><tr><td>冷墨</td><td><code>#141819</code></td><td>正文底色</td></tr><tr><td>旧金</td><td><code>#C9B083</code></td><td>标题与导航</td></tr><tr><td>冷青</td><td><code>#9FBABB</code></td><td>外链与代码</td></tr><tr><td>朱砂</td><td><code>#DF8B7D</code></td><td>提示与重点</td></tr></tbody></table>
      <h2 id="section-clues">贰 · 宣纸</h2><p>浅色模式以 <code>#F1EDE3</code> 为纸，<code>#292F2D</code> 为墨。古铜与朱砂压低亮度，让强调文字在浅底上依然清晰。</p>
      <h3 id="section-tasks">阅读的分寸</h3><p>正文保留系统无衬线字体；标题才借用宋体的笔意。<mark>装饰退后，文字在前。</mark></p>
      <h3 id="section-code">离线可用</h3><p>不加载网络字体、图片或脚本。主题只需要 <code>theme.css</code> 和 <code>manifest.json</code>。</p><hr><p class="note-end">冷墨为底，旧金为引。</p>`
  }
};
let currentNote = 'journal';
let editing = false;

function setTheme(mode) {
  const light = mode === 'light';
  document.body.classList.toggle('theme-light', light);
  document.body.classList.toggle('theme-dark', !light);
  $('#theme-toggle').setAttribute('aria-pressed', String(light));
  $('#theme-toggle').setAttribute('aria-label', light ? '切换至墨夜深色' : '切换至宣纸浅色');
  $('#theme-toggle span').textContent = light ? '墨夜' : '宣纸';
  $('#theme-toggle use').setAttribute('href', light ? '#i-moon' : '#i-sun');
  $('#mode-name').textContent = light ? '宣纸' : '墨夜';
  $('#color-scheme').value = mode;
  const url = new URL(location.href);
  url.searchParams.set('theme', mode);
  if (location.protocol !== 'file:') history.replaceState(null, '', url);
}

function setEditing(value) {
  editing = value;
  $('#reading-pane').hidden = value;
  $('#editing-pane').hidden = !value;
  $('#mode-toggle').setAttribute('aria-pressed', String(value));
  $('#mode-toggle span').textContent = value ? '阅读预览' : '编辑预览';
  $('#mode-toggle use').setAttribute('href', value ? '#i-book' : '#i-pen');
  $('#view-status').textContent = value ? '编辑样式示意' : '阅读预览';
  $('.mod-right-split').setAttribute('aria-hidden', String(value));
  $('.outline').inert = value;
  if (value && currentNote !== 'journal') showNote('journal', false);
}

function showNote(key, exitEditing = true) {
  const note = notes[key];
  if (!note) return;
  currentNote = key;
  $('#reading-pane').innerHTML = note.markup;
  $('#breadcrumb-title').textContent = note.title;
  $$('.outline a').forEach((anchor, index) => {
    anchor.textContent = note.outline[index];
  });
  $$('[data-note]').forEach((el) => {
    const active = el.dataset.note === key;
    el.classList.toggle('is-active', active);
    if (el.getAttribute('role') === 'tab') {
      el.setAttribute('aria-selected', String(active));
      el.tabIndex = active ? 0 : -1;
    }
  });
  if (exitEditing) setEditing(false);
  $('#note-scroller').scrollTop = 0;
  setSidebar(false);
}

function setSidebar(open) {
  document.body.classList.toggle('sidebar-open', open);
  $('#sidebar-scrim').hidden = !open;
  $('.mobile-menu').setAttribute('aria-expanded', String(open));
}

function renderSearch() {
  const query = $('#note-search').value.trim().toLowerCase();
  const results = Object.entries(notes).filter(([, note]) => note.title.toLowerCase().includes(query));
  $('#search-results').replaceChildren();
  for (const [key, note] of results) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-item';
    button.textContent = note.title;
    button.addEventListener('click', () => {
      showNote(key);
      $('#search-dialog').close();
    });
    $('#search-results').append(button);
  }
  if (!results.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = '没有匹配的笔记。试试「夜行」或「墨影」。';
    $('#search-results').append(empty);
  }
}

$$('[data-note]').forEach((el) => el.addEventListener('click', () => showNote(el.dataset.note)));
$$('[role="tab"]').forEach((el, index, tabs = $$('[role="tab"]')) => {
  el.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].click();
    tabs[next].focus();
  });
});

$('#theme-toggle').addEventListener('click', () => setTheme(document.body.classList.contains('theme-dark') ? 'light' : 'dark'));
$('#mode-toggle').addEventListener('click', () => setEditing(!editing));
$('#color-scheme').addEventListener('change', (event) => setTheme(event.target.value));
$('#font-size').addEventListener('input', (event) => {
  document.body.style.setProperty('--font-text-size', `${event.target.value}px`);
  $('#font-size-value').textContent = event.target.value;
});
$('#readable-width').addEventListener('change', (event) => {
  document.body.style.setProperty('--file-line-width', event.target.checked ? '45rem' : '100%');
});
$('#note-search').addEventListener('input', renderSearch);
$('#sidebar-scrim').addEventListener('click', () => setSidebar(false));

$$('[data-action]').forEach((el) => el.addEventListener('click', () => {
  const action = el.dataset.action;
  if (action === 'files') {
    if (matchMedia('(max-width: 760px)').matches) setSidebar(!document.body.classList.contains('sidebar-open'));
    else $('.nav-file-title.is-active')?.focus();
  }
  if (action === 'settings') $('#settings-dialog').showModal();
  if (action === 'search') {
    $('#note-search').value = '';
    renderSearch();
    $('#search-dialog').showModal();
    $('#note-search').focus();
  }
  if (action === 'graph') {
    let dialog = $('#graph-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'graph-dialog';
      dialog.className = 'modal preview-dialog';
      dialog.setAttribute('aria-labelledby', 'graph-title');
      dialog.innerHTML = '<div class="dialog-heading"><h2 id="graph-title">局部关系图</h2><button class="icon-button" aria-label="关闭关系图">×</button></div><p class="dialog-description">关系图颜色示意。安装到 Obsidian 后由真实笔记关系生成。</p>';
      dialog.append($('.local-graph').cloneNode(true));
      dialog.querySelector('button').addEventListener('click', () => dialog.close());
      document.body.append(dialog);
    }
    dialog.showModal();
  }
}));

$$('[data-close-dialog]').forEach((el) => el.addEventListener('click', () => el.closest('dialog').close()));
document.addEventListener('change', (event) => {
  if (event.target.matches('.task-list-item-checkbox')) event.target.closest('.task-list-item').classList.toggle('is-checked', event.target.checked);
});
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a');
  if (anchor?.getAttribute('href') === '#') event.preventDefault();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setSidebar(false);
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p' && !document.querySelector('dialog[open]')) {
    event.preventDefault();
    $('[data-action="search"]').click();
  }
});
matchMedia('(max-width: 760px)').addEventListener('change', () => setSidebar(false));
setTheme(new URLSearchParams(location.search).get('theme') === 'light' ? 'light' : 'dark');
if (new URLSearchParams(location.search).get('view') === 'edit') setEditing(true);
