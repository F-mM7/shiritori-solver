const INPUT_MAX = 24;
const ANSWER_MAX = 24;

const SAMPLE_WORDS = [
  "とりひき",
  "いちじく",
  "すべて",
  "かくちょう",
  "きもの",
  "るっくす",
  "くろこ",
  "りゅうは",
  "てがら",
  "えいと",
  "のこり",
  "りかい",
  "うみ",
  "ふつかよい",
  "らいふ",
  "はたち",
  "ちゅうか",
  "みらくる",
  "いのちとり",
];

let w;
let v;
let dp;

let answer_cnt;
input.rows = INPUT_MAX;

button.onclick = function () {
  console.log("solving..");

  //reset
  clearChildren(answer_list);
  answer_cnt = 0;

  //get input
  w = input.value.split(/\r\n|\n|\r/).filter((e) => e != "");
  let N = w.length;

  if (N > INPUT_MAX) {
    const e = document.createElement("div");
    e.innerHTML = "too many input\n";
    e.innerHTML += "(N = " + N + " > " + INPUT_MAX + ")";
    answer_list.appendChild(e);
    return;
  }

  //shiritori
  let b = Array.from(new Array(N), () => new Array(N));
  for (let i = 0; i < N; ++i)
    for (let j = 0; j < N; ++j) b[i][j] = w[i][0] == w[j][w[j].length - 1];

  //dp
  dp = Array.from(new Array(1 << N), () => new Array(N));
  for (let i = 0; i < N; ++i) dp[1 << i][i] = [[0, -1]];
  for (let x = 0; x < 1 << N; ++x)
    for (let i = 0; i < N; ++i) {
      if (!dp[x][i]) continue;
      for (let j = 0; j < N; ++j) {
        if (!b[i][j] || x & (1 << j)) continue;
        const y = x | (1 << j);
        if (!dp[y][j]) dp[y][j] = [];
        dp[y][j].push([x, i]);
      }
    }

  //make answer
  for (let i = 0; i < N; ++i)
    if (dp[(1 << N) - 1][i]) {
      v = [];
      dfs((1 << N) - 1, i);
    }

  console.log("done!");
};

sample.onclick = function () {
  input.value = "";
  for (s of SAMPLE_WORDS) input.value += s + "\n";
};

clear.onclick = function () {
  input.value = "";
};

function dfs(x, i) {
  if (answer_cnt == ANSWER_MAX) return;
  if (!x) {
    appendAnswer();
    return;
  }

  v.push(i);
  for (let [y, j] of dp[x][i]) dfs(y, j);
  v.pop();
}

function appendAnswer() {
  const answer = document.createElement("ol");
  for (let i in v) {
    const d = document.createElement("li");
    d.innerHTML = w[v[i]];
    answer.appendChild(d);
  }
  answer_list.appendChild(answer);
  ++answer_cnt;
}
