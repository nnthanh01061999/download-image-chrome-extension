import React from 'react';
import './App.css';
import ImageCard from './components/ImageCard';
import Information from './components/Information';
import { DOMMessage, DOMMessageResponse, Image } from './types';
import { checkImage, handleDownloadAllImage } from './utils';

function App() {
    const [data, setData] = React.useState<Image[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);

    const onSelect = (item: string) => {
        selected.includes(item)
            ? setSelected([...selected.filter((itm) => itm !== item)])
            : setSelected([...selected, item]);
    };

    const onDownloadError = (src: string) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.src === src
                    ? { ...item, error: 'Error download image!' }
                    : item
            )
        );
    };

    const handleSelectAllImage = () => {
        if (selected.length === data.length) {
            setSelected([]);
        } else {
            setSelected([...data.map((item) => item.src)]);
        }
    };

    React.useEffect(() => {
        /**
         * We can't use "chrome.runtime.sendMessage" for sending messages from React.
         * For sending messages from React we need to specify which tab to send it to.
         */
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        { type: 'GET_DOM' } as DOMMessage,
                        (response: DOMMessageResponse) => {
                            var url = new URL(tabs[0].url || '');
                            var domain = url.hostname;

                            let imgs = response.images?.map((item) => {
                                return {
                                    ...item,
                                    src: checkImage(
                                        item.src,
                                        domain,
                                        tabs[0].url
                                    ),
                                };
                            });
                            imgs = [
                                ...((new Map(
                                    imgs.map((item) => [item['src'], item])
                                ).values() as any) || []),
                            ];
                            setData(imgs);
                        }
                    );
                }
            );
    }, []);

    return (
        <div className='App'>
            <div className='container'>
                <Information
                    total={data.length}
                    totalSelected={selected.length}
                />
                <div className='action'>
                    <button
                        disabled={data.length === 0}
                        className='btn'
                        onClick={handleSelectAllImage}
                    >
                        Select All
                    </button>
                    <button
                        disabled={selected.length === 0}
                        className='btn'
                        onClick={handleDownloadAllImage(
                            selected,
                            onDownloadError
                        )}
                    >
                        Download All Selected
                    </button>
                </div>
            </div>
            <div className='image-wrapper'>
                {data?.map((item, index) => (
                    <ImageCard
                        key={index}
                        data={item}
                        selected={selected?.includes(item.src)}
                        onSelect={() => onSelect(item.src)}
                        onDownloadError={onDownloadError}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
