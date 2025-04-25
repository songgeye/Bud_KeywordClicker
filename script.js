let selectedKeywords = new Set();

// 単一キーワード選択機能
document.querySelectorAll('[data-copy]').forEach(element => {
  // イベントハンドラー修正
element.addEventListener('click', function(e) {
  e.stopPropagation(); // 追加
  if (e.detail >= 2) return;
  
  const keyword = this.textContent.trim();
  toggleSelection(keyword, this);
  });
});

// 一括コピー機能
document.getElementById('bulkCopy').addEventListener('click', () => {
  const keywords = Array.from(selectedKeywords).join(' ');
  if (keywords) {
    copyToClipboard(keywords);
    showFeedback(`${selectedKeywords.size}個のキーワードをコピーしました`);
    clearSelection();
  }
});

function toggleSelection(keyword, element) {
  if (selectedKeywords.has(keyword)) {
    selectedKeywords.delete(keyword);
    element.classList.remove('selected');
  } else {
    selectedKeywords.add(keyword);
    element.classList.add('selected');
  }
  updateCounter();
}

function updateCounter() {
  document.getElementById('selectedCount').textContent = selectedKeywords.size;
}

function clearSelection() {
  selectedKeywords.clear();
  document.querySelectorAll('.keyword.selected').forEach(el => 
    el.classList.remove('selected')
  );
  updateCounter();
}

// 仮想DOMによる効率的なレンダリング
const observer = new MutationObserver(() => {
  document.querySelectorAll('[data-copy]').forEach(attachHandler);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// AIレコメンド機能の擬似コード
async function recommendKeywords() {
  const usagePattern = analyzeUserBehavior();
  const response = await fetch('/api/recommend', {
    method: 'POST',
    body: JSON.stringify(usagePattern)
  });
  const recommendations = await response.json();
  updateUI(recommendations);
}
