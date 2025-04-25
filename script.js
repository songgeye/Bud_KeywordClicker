const selected = new Set();
const keywordEls = document.querySelectorAll('.keyword');
const selectedCount = document.getElementById('selectedCount');
const feedback = document.getElementById('feedback');

keywordEls.forEach(el => {
  el.addEventListener('click', () => {
    const word = el.textContent.trim();
    if (el.classList.contains('selected')) {
      el.classList.remove('selected');
      selected.delete(word);
    } else {
      el.classList.add('selected');
      selected.add(word);
    }
    selectedCount.textContent = selected.size;
  });
});

document.getElementById('bulkCopy').addEventListener('click', async () => {
  if (selected.size === 0) {
    showFeedback('キーワードを選択してください', true);
    return;
  }
  const text = Array.from(selected).join(' ');
  try {
    await navigator.clipboard.writeText(text);
    showFeedback('コピーしました！');
  } catch (e) {
    showFeedback('コピーに失敗しました', true);
  }
});

function showFeedback(msg, isError) {
  feedback.textContent = msg;
  feedback.style.background = isError ? '#c00' : '#333';
  feedback.classList.add('show');
  setTimeout(() => feedback.classList.remove('show'), 1800);
}
