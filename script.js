let selectedKeywords = new Set();

// 強化版コピー関数
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (err) {
    console.error('コピー失敗:', err);
    return false;
  }
}

// 改良版バルクコピー処理
document.getElementById('bulkCopy').addEventListener('click', async () => {
  const keywords = Array.from(selectedKeywords).join(' ');
  if (!keywords) return;
  
  const success = await copyToClipboard(keywords);
  if (success) {
    showFeedback(`${selectedKeywords.size}個のキーワードをコピー成功`);
    clearSelection();
  } else {
    showFeedback('コピーに失敗しました', true);
  }
});
