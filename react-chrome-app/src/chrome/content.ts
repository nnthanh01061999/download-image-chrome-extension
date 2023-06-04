import { DOMMessage, DOMMessageResponse, Video } from '../types';

const messagesFromReactAppListener = (
    _: DOMMessage,
    __: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void
) => {
    const response: DOMMessageResponse = {
        images: Array.from(document.getElementsByTagName<'img'>('img')).map(
            (link) => ({
                src: link.getAttribute('src') || '',
                alt: link.getAttribute('alt') || '',
            })
        ),
        videos: Array.from(document.getElementsByTagName<'video'>('video'))
            .filter((link) => !link.getAttribute('id')?.includes('preview'))
            .map((link) => {
                if (link.getAttribute('src')) {
                    return {
                        src: link.getAttribute('src') || '',
                        type: link.getAttribute('type') || '',
                    };
                } else {
                    return Array.from(
                        link.getElementsByTagName<'source'>('source')
                    ).map((source: any) => ({
                        src: source.getAttribute('src') || '',
                        type: source.getAttribute('type') || '',
                    }));
                }
            })
            .reduce(
                (prev: Video[], cur) => [
                    ...prev,
                    ...(Array.isArray(cur) ? cur : [cur]),
                ],
                []
            ),
    };

    sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
