import { downLoadImage } from '../utils';
import BlankIcon from '../images/svg/BlankIcon';
import CheckIcon from '../images/svg/CheckIcon';
import DownloadIcon from '../images/svg/DownloadIcon';
import { Image } from '../types';
import { useState } from 'react';

interface Props {
    data: Image;
    selected: boolean;
    onSelect: () => void;
    onDownloadError: (src: string) => void;
}

function ImageCard(props: Props) {
    const { data, selected, onSelect, onDownloadError } = props;

    const [imageSrc, setImageSrc] = useState(data.src);

    const handleOpenImage = () => {
        window.open(data.src, '_blank');
    };

    const onLoadError = () => {
        setImageSrc('./images/no-image.png');
    };

    return (
        <div className='image-card'>
            <div className={`image-container${selected ? ' selected' : ''}`}>
                <div
                    style={data?.error ? { opacity: '0.5' } : {}}
                    className={`image-container__image`}
                    onClick={onSelect}
                >
                    <img
                        className='image'
                        src={imageSrc}
                        alt={data.alt}
                        onError={onLoadError}
                    />
                </div>
                <div className='actions-container'>
                    <span
                        className='action-icon'
                        onClick={downLoadImage(data, onDownloadError)}
                    >
                        <DownloadIcon />
                    </span>
                    <span className='action-icon' onClick={handleOpenImage}>
                        <BlankIcon />
                    </span>
                </div>
                {selected && (
                    <span className='check-icon'>
                        <CheckIcon />
                    </span>
                )}
                {data?.error && (
                    <span className='error-message'>{data.error}</span>
                )}
            </div>
        </div>
    );
}

export default ImageCard;
