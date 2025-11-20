import type { Message } from '../types.ts'

const GPM_URL = 'https://passwords.google.com/'

const injectScript = (tabId: number, domain: string) => {
    const inject = (triesLeft = 10) => {
        chrome.scripting.executeScript(
            {
                target: { tabId },
                func: (domainToSearch: string) => {
                    const trySet = () => {
                        const search = document.querySelector('input[type="text"], input[type="search"]')
                        
                        if (search instanceof HTMLInputElement) {
                            search.focus()
                            search.value = domainToSearch
                            search.dispatchEvent(new Event('input', { bubbles: true }))
                            search.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
                            return true
                        }
                        return false
                    }

                    if (!trySet()) {
                        const observer = new MutationObserver((_, obs) => {
                            if (trySet()) obs.disconnect()
                        })
                        observer.observe(document.body, { childList: true, subtree: true })
                        setTimeout(() => observer.disconnect(), 6000)
                    }
                },
                args: [domain],
            },
            () => {
                if (chrome.runtime.lastError && triesLeft > 0) {
                    setTimeout(() => inject(triesLeft - 1), 500)
                }
            }
        )
    }

    setTimeout(() => inject(), 1000)
}

const openGPM = (domain: string) => {
    chrome.windows.create(
        {
            url: GPM_URL,
            type: 'popup',
            width: 900,
            height: 700,
        },
        (win) => {
            if (chrome.runtime.lastError) {
                console.error('Error creating window:', chrome.runtime.lastError)
                return
            }

            const tab = win?.tabs?.[0]
            if (!tab?.id) {
                console.error('Unable to access Google Password Manager window.')
                return
            }

            injectScript(tab.id, domain)
        }
    )
}

chrome.action.onClicked.addListener((tab) => {
    if (tab.url) {
        try {
            const url = new URL(tab.url)
            if (url.protocol.startsWith('http')) {
                openGPM(url.hostname)
            } else {
                openGPM('')
            }
        } catch {
            openGPM('')
        }
    } else {
        openGPM('')
    }
})

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    if (message.action === 'open_gpm_for_domain') {
        openGPM(message.domain)
        sendResponse({ success: true })
        return true
    }
    return false
})