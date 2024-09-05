console.log('content script initialized')

export type CSMessage = {
  action: string;
}

chrome.runtime.onMessage.addListener(async (message: CSMessage, sender, sendResponse) => {
  const response = `content script received message: ${message.action}`
  console.log(response)
  console.log('sender:', sender)
  sendResponse(response)
})