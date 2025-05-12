document.addEventListener('DOMContentLoaded', () => {
  // コピー対象となるキーワード群を含むコンテナ
  const commaSection = document.querySelector('.comma-section');
  // コピー実行ボタン（HTML 側で <button class="copy-btn">などを想定）
  const copyBtn = document.querySelector('.copy-btn');

  // 1. キーワードクリックで選択・解除
  commaSection.addEventListener('click', (e) => {
    // .keyword-comma 要素以外は無視
    const kw = e.target.closest('.keyword-comma');
    if (!kw) return;
    // 選択状態をクラスでトグル（CSS でハイライト可能）
    kw.classList.toggle('selected');
  });

  // 2. コピー実行時の処理
  copyBtn.addEventListener('click', () => {
    // .comma-section 内の選ばれた .keyword-comma だけ取得
    const selected = commaSection.querySelectorAll('.keyword-comma.selected');

    // テキストを抽出し、すべての空白を削除 → カンマで結合
    const result = Array.from(selected)
      .map(el => el.textContent.replace(/\s+/g, ''))
      .join(',');

    // クリップボードに書き出し
    navigator.clipboard.writeText(result)
      .then(() => {
        // 必要に応じてフィードバック表示
        console.log('Copied to clipboard:', result);
      })
      .catch(err => {
        console.error('コピーに失敗しました:', err);
      });
  });
});
