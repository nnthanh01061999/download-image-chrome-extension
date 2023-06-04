import React from 'react';
import './App.css';
import ImageCard from './components/ImageCard';
import Information from './components/Information';
import Tab from './components/Tab';
import Show from './components/condition/Show';
import { DOMMessage, DOMMessageResponse, Image, Video } from './types';
import { checkImage, downloadAllImage } from './utils';
import Empty from './components/Empty';

function App() {
    const [tab, setTab] = React.useState<string>('image');

    const [images, setImages] = React.useState<Image[]>([]);
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [selectedImage, setselectedImage] = React.useState<string[]>([]);

    const onSelect = (item: string) => {
        selectedImage.includes(item)
            ? setselectedImage([...selectedImage.filter((itm) => itm !== item)])
            : setselectedImage([...selectedImage, item]);
    };

    const onDownloadError = (src: string) => {
        setImages((prevImage) =>
            prevImage.map((item) =>
                item.src === src
                    ? { ...item, error: 'Error download images!' }
                    : item
            )
        );
    };

    const handleSelectAllImage = () => {
        if (selectedImage.length === images.length) {
            setselectedImage([]);
        } else {
            setselectedImage([...images.map((item) => item.src)]);
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
                            setImages(imgs);

                            setVideos(response.videos);
                        }
                    );
                }
            );
    }, []);

    return (
        <div className='App'>
            <Tab value={tab} onChange={(value) => setTab(value)} />
            <Show when={tab === 'image'}>
                <div className='container'>
                    <Information
                        total={images.length}
                        totalSelected={selectedImage.length}
                    />
                    <div className='action'>
                        <button
                            disabled={images.length === 0}
                            className='btn'
                            onClick={handleSelectAllImage}
                        >
                            Select All
                        </button>
                        <button
                            disabled={selectedImage.length === 0}
                            className='btn'
                            onClick={downloadAllImage(
                                selectedImage,
                                onDownloadError
                            )}
                        >
                            Download All Selected
                        </button>
                    </div>
                </div>
                <div className='image-wrapper'>
                    {images.length > 0 ? (
                        images?.map((item, index) => (
                            <ImageCard
                                key={index}
                                data={item}
                                selected={selectedImage?.includes(item.src)}
                                onSelect={() => onSelect(item.src)}
                                onDownloadError={onDownloadError}
                            />
                        ))
                    ) : (
                        <Empty />
                    )}
                </div>
            </Show>
            <Show when={tab === 'video'}>
                <div className='image-wrapper'>
                    {videos?.length ? (
                        <table className='video-table'>
                            <tr>
                                <th className='video-table-head'>
                                    Video link:
                                </th>
                            </tr>
                            {videos.map((video, index) => (
                                <tr key={index}>
                                    <td className='video-table-row'>
                                        <a href={video.src}>{video?.src}</a>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    ) : (
                        <Empty />
                    )}
                </div>
            </Show>
        </div>
    );
}

export default App;
