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
        word += nextSibling.textContent.trim();  // カンマを結合 (カンマ部分もtrim)
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

    let textParts = [];
    // DOMの順序で選択されたキーワードを処理
    keywordEls.forEach(el => {
        // selectedセットに格納されている形式の文字列を生成
        let wordInSet = el.textContent.trim();
        if (el.classList.contains('keyword-comma')) {
            const nextSibling = el.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('comma')) {
                wordInSet += nextSibling.textContent.trim(); 
            }
        }

        if (selected.has(wordInSet)) {
            let processedText;
            if (el.classList.contains('keyword-comma')) {
                // カンマ区切りキーワード (.keyword-comma) の場合
                let baseText = el.textContent.trim();
                baseText = baseText.replace(/\s+/g, ''); // テキスト本体から全てのスペースを削除
                processedText = baseText;
                const nextSibling = el.nextElementSibling;
                if (nextSibling && nextSibling.classList.contains('comma')) {
                    processedText += nextSibling.textContent.trim(); // カンマを追加
                }
            } else {
                // カテゴリキーワード (.keyword) の場合
                processedText = el.textContent.trim(); // そのまま使用
            }
            textParts.push(processedText);
        }
    });

    let text = textParts.join(' '); // 各パーツをスペースで結合

    // 最終的に「スペース + カンマ」を「カンマ」に置換
    text = text.replace(/ \,/g, ',');

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
    feedback.classList.add('show'); // CSSでのopacity制御のためクラス変更

    setTimeout(() => {
        feedback.classList.remove('show');
        // トランジション完了後にテキストをクリアするなら、CSSのtransitionendイベントを使うか、
        // opacityのトランジション時間に合わせてさらにsetTimeoutを設定
        // ここでは簡略化のため、remove('show')で非表示にする
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
