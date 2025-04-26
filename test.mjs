import { CommitParser, parseCommits, parseCommitsStream } from 'conventional-commits-parser'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import gitLog from 'gitlog'
import { resolve } from 'path'

const logOpts = {
  repo: './',
  //since: '2025-04-26 +0800',
  nameStatus: false,
  fields: ['abbrevHash', 'rawBody', 'committerName', 'committerDate'],
}

const commits = await gitLog(logOpts)

const delimiter = '∩'
const commitsMessages = commits.map(({ abbrevHash, rawBody }) => {
  const msgIndex = calcMessageStartIndex(rawBody)
  const start = rawBody.slice(0, msgIndex)
  const end = rawBody.slice(msgIndex)
  return `${start}${abbrevHash}${delimiter}${end}`
})

console.table(commitsMessages)

const regex = /^(?::\w+:\s)?(\w+)(?:\(([\w\$\.\-\* ]*)\))?:\s*(.*)$/
const emojiRegex = /^:\w+:/g
//const defaultRegex = /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/

convertCommits(commitsMessages)
  .then(groupByType)
  .then((groups) => {
    console.log(groups)
  })

function calcMessageStartIndex(commitMsg) {
  // 匹配表情符号 + type + scope 部分
  const prefixMatch = commitMsg.match(/^(?::\w+:)?\s*\w+(?:\([^)]*\))?:\s*/)
  return prefixMatch ? prefixMatch[0].length : -1
}

const config = {
  repoPath: '.', // 仓库路径
  since: '2023-01-01', // 起始日期
  until: new Date(), // 结束日期
  types: {
    // 提交类型映射
    feat: { emoji: '🎁', title: '新功能' },
    fix: { emoji: '🐛', title: 'Bug修复' },
    docs: { emoji: '📝', title: '文档更新' },
    chore: { emoji: '🔧', title: '维护任务' },
    build: { emoji: '📦️ ', title: '打包' },
    release: { emoji: '🎉', title: '发布正式版' },
    style: { emoji: '🎨', title: '代码的样式美化' },
    test: { emoji: '✅', title: '测试' },
    revert: { emoji: '⏪️', title: '构建/工程依赖/工具改动' },
    ci: { emoji: '👷', title: 'CI related changes' },
  },
}

function groupByType(commits) {
  const grouped = commits.reduce((acc, commit) => {
    const typeInfo = config.types[commit.type] || {
      emoji: '🔹',
      title: commit.type,
    }
    const groupKey = `${typeInfo.emoji} ${typeInfo.title}`

    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(commit)
    return acc
  }, {})
  return grouped
}

function convertCommits(msgList = []) {
  const commits = []
  const size = msgList.length
  return new Promise((resolve) => {
    Readable.from(msgList, {
      encoding: 'utf-8',
    })
      .pipe(parseCommitsStream({ headerPattern: regex }))
      .on('data', (commit) => {
        const cm = convertCommit(commit)
        commits.push(cm)
        const end = commits.length === commitsMessages.length
        console.log({ hash: cm.hash, end, size1: commits.length, size })
        if (commits.length === 7) {
          //console.log(commits)
          resolve(commits)
        }
      })
  })
}

function convertCommit(commit) {
  const { header, subject, type } = commit
  const emoji = header.match(emojiRegex)
  const [hash, sub] = subject.split(delimiter)
  commit.emoji = Array.isArray(emoji) ? emoji[0] : null
  commit.subject = sub
  commit.header = `${type}: ${sub}`
  commit.hash = hash
  const contributor = commits.find((item) => item.abbrevHash === hash).committerName
  commit.contributor = contributor
  return commit
}
