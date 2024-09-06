console.log('service worker initialized')

export type BGMessage = {
  action: 'get_pat'
} | {
  action: 'set_pat'
  pat: string
}

// TODO: うまく取得できないので見直し
chrome.runtime.onMessage.addListener(async (message: BGMessage, _, sendResponse) => {
  switch (message.action) {
    case 'get_pat': {
      const pat = (await chrome.storage.local.get('pat'))['pat']
      sendResponse(pat)
      break
    }
    case 'set_pat': {
      await chrome.storage.local.set({ pat: message.pat })
      sendResponse('pat set')
      break
    }
  }
})