import { DOMMessage, DOMMessageResponse } from '../types';

const messagesFromReactAppListener = (
    _: DOMMessage,
    __: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void
) => {
    const response: DOMMessageResponse = {
        images: Array.from(document.getElementsByTagName<'img'>('img')).map(
            (link: any) => ({
                src: link.getAttribute('src') || '',
                alt: link.getAttribute('alt') || '',
            })
        ),
    };

    sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
