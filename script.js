// 選択状態の管理
const selected = new Set();
const keywordEls = document.querySelectorAll('.keyword, .keyword-comma');
const selectedCount = document.getElementById('selectedCount');
const feedback = document.getElementById('feedback');

// キーワードの選択イベント
keywordEls.forEach(el => {
  el.addEventListener('click', () => {
    let word = el.textContent.trim();
    
    // keyword-commaの場合、カンマを含める
    if (el.classList.contains('keyword-comma')) {
      const nextSibling = el.nextElementSibling;
      if (nextSibling && nextSibling.classList.contains('comma')) {
        word += nextSibling.textContent;  // カンマを結合
      }
    }
    
    if (selected.has(word)) {
      selected.delete(word);
      el.classList.remove('selected');
    } else {
      selected.add(word);
      el.classList.add('selected');
    }
    selectedCount.textContent = selected.size;
  });
});

// コピーボタンのイベント
document.getElementById('bulkCopy').addEventListener('click', async () => {
    if (selected.size === 0) {
        showFeedback('キーワードを選択してください', true);
        return;
    }

    let text = Array.from(selected)
        .map(item => item.trim())
        .join(' ');

    // 「 ,」→「,」に置換してカンマ前のスペースを除去
    text = text.replace(/ \,/g,',');
    // text = text.replace(/\s+/g, '');

    try {
        await navigator.clipboard.writeText(text);
        showFeedback('コピーしました！');
    } catch (e) {
        console.error('コピーエラー:', e);
        fallbackCopy(text);
    }
});

// フィードバックの表示
function showFeedback(msg, isError = false) {
    feedback.textContent = msg;
    feedback.style.background = isError ? '#c00' : '#333';
    feedback.style.opacity = '1';

    // 2.5秒後に透明化
    setTimeout(() => {
        feedback.style.opacity = '0';

        // 透明化後、さらに0.5秒後にテキストやスタイルをリセット
        setTimeout(() => {
            feedback.textContent = '';
            feedback.style.background = '#333'; // デフォルト色に戻す（必要なら）
        }, 500);
    }, 2500);
}

// フォールバックコピー処理（navigator.clipboardが使えない場合）
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const success = document.execCommand('copy');
    if (success) {
      showFeedback('コピーしました！');
    } else {
      showFeedback('コピーに失敗しました', true);
    }
  } catch (e) {
    showFeedback('コピーに失敗しました', true);
  } finally {
    document.body.removeChild(textarea);
  }
}
