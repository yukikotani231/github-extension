console.log('service worker initialized')

export type BGMessage = {
  action: string
}

chrome.runtime.onMessage.addListener(async (message: BGMessage, sender, sendResponse) => {
  const response = `background script received message: ${message.action}`
  console.log(response)
  console.log('sender:', sender)
  sendResponse(response)
})