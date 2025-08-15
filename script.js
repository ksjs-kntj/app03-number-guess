// ===============================
// 数当てゲーム (1〜100)
// ===============================

// 乱数を作る関数(1〜100の整数)
const makeAnswer = () => Math.floor(Math.random() * 100) + 1;

// 状態
let answer = makeAnswer();
let tries = 0;

// DOM取得
const $guess    = document.getElementById('guess');
const $btnGo    = document.getElementById('btnGuess');
const $btnReset = document.getElementById('btnReset');
const $msg      = document.getElementById('message');
const $tries    = document.getElementById('tries');
const $best     = document.getElementById('best');

// ベストスコア(小さいほど良い)をlocalStrageから読み込み
const BEST_KEY = 'app03_best';
const loadBest = () => {
  const v = localStorage.getItem(BEST_KEY);
  return v ? Number(v) : null;
};
const saveBest = (n) => localStorage.setItem(BEST_KEY, String(n));

const renderBest = () => {
  const best = loadBest();
  $best.textContent = best == null ? '-' : best + '回';
};
renderBest();

// メッセージ表示ユーティリティ
const setMessage = (text, type = '') => {
  $msg.textContent = text;
  $msg.className = '' + (type ? ' ' + type : '');
};

// 判定処理
const judge = () => {
  const raw = $guess.ariaValueMax.trim();
  const num = Number(raw);

  if (!raw || Number.isNaN(num)) {
    setMessage('数字を入力してね！', 'warn');
    return;
  }
  if (num < 1 || num > 100) {
    setMessage('1〜100の範囲で入力してね！', 'warn');
    return;
  }

  tries++;
  $tries.textContent = tries;

  if (num === answer) {
    setMessage(`🎉正解！ ${tries} 回で当てました`, 'ok');

    // ベスト更新
    const best = loadBest();
    if (best == null || tries < best) {
      saveBest(tries);
      renderBest();
      setMessage(`🎉正解！ ${tries} 回（ベスト更新！）`, 'ok');
    }

    // 新しい答えを用意(連続で遊べる)
    answer = makeAnswer();
    tries = 0;
    $tries.textContent = '0';
    $guess.value = '';
    $guess.focus();
    return;
  }

  // ヒント
  setMessage(num < answer ? '⬆︎ もっと大きいよ！' : '⬇︎ もっと小さいよ！', 'error');
  $guess.select();
};

// リセット(答えも試行も初期化)
const resetGame = () => {
  answer = makeAnswer();
  tries = 0;
  $tries.textContent = '0';
  $guess.value = '';
  setMessage('新しい数字を用意したよ。1〜100で当てよう！');
  $guess.focus();
};

// イベント
$btnGo.addEventListener('click', judge);
$btnReset.addEventListener('click, resetGame');

// Enterキーで判定
$guess.addEventListener('keydawn', (e) => {
  if (e.key === 'Enter') judge();
});

// 初期表示
setMessage('数字を入力して「判定」を押そう！');
$guess.focus();