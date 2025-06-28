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
        // カンマを結合 (カンマ自体にスペースは通常ないが、念のためtrim)
        word += nextSibling.textContent.trim(); 
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

    const spaceKeywords = [];
    const commaKeywords = [];

    // 選択されたキーワードを分類
    selected.forEach(item => {
        // '.keyword-comma' からのアイテムは、処理時に末尾にカンマが結合されている (例: "単語,")
        // '.keyword' からのアイテムはカンマなし (例: "単語")
        if (item.endsWith(',')) {
            commaKeywords.push(item);
        } else {
            spaceKeywords.push(item);
        }
    });

    let textToCopy = '';
    const spacePart = spaceKeywords.join(' '); // スペース区切り部分
    // commaKeywords の各要素は "単語," の形なので、単純に連結すれば "単語,単語,単語," となる
    const commaPart = commaKeywords.join('');   // カンマ区切り部分 (スペースなし)

    if (spacePart && commaPart) {
        // 両方のタイプのキーワードが選択されている場合、
        // スペース区切り部分とカンマ区切り部分をスペース一つで連結する
        textToCopy = spacePart + ' ' + commaPart;
    } else if (spacePart) {
        textToCopy = spacePart;
    } else if (commaPart) {
        textToCopy = commaPart;
        // commaPart は "単語,単語," のように、最後に選択されたカンマ付きキーワードのカンマで終わる。
        // HTML の .comma-section の表示上も各行の最後はカンマで終わっているため、これで一貫性がある。
    }

    try {
        await navigator.clipboard.writeText(textToCopy);
        showFeedback('コピーしました！');
    } catch (e) {
        console.error('コピーエラー:', e);
        fallbackCopy(textToCopy);
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
