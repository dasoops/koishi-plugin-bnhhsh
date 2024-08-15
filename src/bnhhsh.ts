import pinyin from 'pinyin';
import * as fs from "node:fs";
import path from "node:path";

type CostRecord = {
  [key: number]: number;
};

type Record = {
  [key: number]: [number, number, string][];
};

type WordBucket = {
  [key: number]: {
    [key: string]: [string, number];
  };
};
function updateBucket(bucket: WordBucket, wordList: string[], pain: number) {
  function pinyinFirstLetter(chinese: string): string {
    const q = pinyin(chinese, {style: pinyin.STYLE_FIRST_LETTER});
    return q.map((x: string[]) => x[0].toLowerCase()).join('');
  }

  for (const word of wordList) {
    const key = pinyinFirstLetter(word);
    const lengthBucket = bucket[word.length] || {};

    if (lengthBucket[key]) {
      if (lengthBucket[key][1] > pain) {
        lengthBucket[key] = [word, pain];
      }
    } else {
      lengthBucket[key] = [word, pain];
    }

    bucket[word.length] = lengthBucket;
  }
}

const here = __dirname;
const 色情词库 = JSON.parse(fs.readFileSync(path.join(here, 'data/色情词库.json'), 'utf8'));
const 色情词库_数据增强 = JSON.parse(fs.readFileSync(path.join(here, 'data/色情词库_数据增强.json'), 'utf8'));
const 莉沫词库 = JSON.parse(fs.readFileSync(path.join(here, 'data/莉沫词库.json'), 'utf8'));
const 常用汉字 = JSON.parse(fs.readFileSync(path.join(here, 'data/常用汉字.json'), 'utf8'));
const 现代汉语常用词表 = JSON.parse(fs.readFileSync(path.join(here, 'data/现代汉语常用词表.json'), 'utf8'));

const wordBucket: WordBucket = {
  1: { 'i': ['爱', 0.1], 'u': ['幼', 0.1] }
};

updateBucket(wordBucket, 色情词库, 0.001);
updateBucket(wordBucket, 莉沫词库, 0.01);
updateBucket(wordBucket, 色情词库_数据增强, 0.1);
updateBucket(wordBucket, 常用汉字, 0.11);
updateBucket(wordBucket, 现代汉语常用词表, 0.2);

function yndp(target: string): [string, number] {
  const cost: CostRecord = {[-1]: 0};
  const record: Record = {[-1]: []};
  const n = Object.keys(wordBucket).length; // 假设n为词桶的最大key

  for (let x = 0; x < target.length; x++) {
    cost[x] = 2 ** 32;

    for (let k = n; k > 0; k--) {
      const s = x - k + 1;
      if (s < 0) {
        continue;
      }

      const wordEntry = wordBucket[k]?.[target.slice(s, x + 1)];
      if (wordEntry) {
        const [word, pain] = wordEntry;
        if (cost[x - k] + pain < cost[x]) {
          cost[x] = cost[x - k] + pain;
          record[x] = [...(record[x - k] || [])];
          record[x].push([s, x + 1, word]);
        }
      }
    }

    if (cost[x - 1] + 1 < cost[x]) {
      cost[x] = cost[x - 1] + 1;
      record[x] = [...(record[x - 1] || [])];
    }
  }

  let targetArr = target.split('');
  for (const [a, b, c] of (record[target.length - 1] || []).reverse()) {
    targetArr.splice(a, b - a, ...c.split(''));
  }

  return [targetArr.join(''), cost[target.length - 1]];
}

function bnhhsh(message: string): string {
  return yndp(message)[0]
}

export default bnhhsh;
