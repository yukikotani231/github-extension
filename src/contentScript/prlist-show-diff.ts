type Repo = { owner: string; name: string; }
type PRInfo = { number: string; lastUpdated: Date; }
type Diff = { addition: number; deletion: number; }

const findGithubPullsElementsFromDom = (): Element[] => {
  return Array.from(document.querySelectorAll('.js-issue-row'))
}

const findPRInfo = (el: Element): PRInfo => {
  // divのidの_以降に書いてある
  const number = el.id.split('_')[1]
  // 更新日時はrelative-timeタグのdatetime属性に書いてある
  const lastUpdated = new Date(el.querySelector('relative-time')?.getAttribute('datetime') || '')
  if (number === '' || lastUpdated === null) {
    throw new Error('PRListItem not found')
  }
  return { number, lastUpdated }
}

const getPRDiffAddtionAndDeletion = async (repo: Repo, pr: PRInfo): Promise<Diff> => {
  const cache = (await chrome.storage.local.get('prDiff'))['prDiff'] || {}
  const key = `${repo.owner}/${repo.name}/${pr.number}`
  const item = cache[key]
  if (item && item.lastUpdated > pr.lastUpdated) {
    return item
  }

  const pat = (await chrome.storage.local.get('pat'))['pat']
  const url = `https://api.github.com/repos/${repo.owner}/${repo.name}/pulls/${pr.number}`
  const response = await fetch(url, { headers: { Authorization: `token ${pat}` } })
  const data = await response.json()
  const diff = {
    addition: data.additions,
    deletion: data.deletions,
    lastUpdated: pr.lastUpdated,
  }

  // TODO: 保存部分を並列化できるようにする
  cache[key] = diff
  await chrome.storage.local.set({ prDiff: cache })
  return diff
}

const getRepoFromUrl = (): Repo => {
  const owner = location.pathname.split('/')[1]
  const name = location.pathname.split('/')[2]
  return { owner, name }
}

const addAdditionAndDeletionToDom = async () => {
  const repo = getRepoFromUrl()
  const prElements = findGithubPullsElementsFromDom()
  for (const el of prElements) {
    const prInfo = findPRInfo(el)
    const diff = await getPRDiffAddtionAndDeletion(repo, prInfo)

    const additionEl = document.createElement('span')
    additionEl.textContent = `+${diff.addition}`
    additionEl.style.color = '#64b75d'
    additionEl.style.fontWeight = '600'
    additionEl.style.marginRight = '5px'

    const deletionEl = document.createElement('span')
    deletionEl.textContent = `-${diff.deletion}`
    deletionEl.style.color = '#e55e51'
    deletionEl.style.fontWeight = '600'

    el.querySelector('.opened-by')?.appendChild(additionEl)
    el.querySelector('.opened-by')?.appendChild(deletionEl)
  }
}

// URLが/*/*/pullsのときだけ実行
// TODO: ページの切り替え時にも実行されるようにする
if (location.pathname.split('/')[3] === 'pulls') {
  addAdditionAndDeletionToDom()
}
