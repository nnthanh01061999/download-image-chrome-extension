import { handleDownLoadImage } from '../utils';
import BlankIcon from '../images/svg/BlankIcon';
import CheckIcon from '../images/svg/CheckIcon';
import DownloadIcon from '../images/svg/DownloadIcon';
import { Image } from '../types';

interface Props {
    data: Image;
    selected: boolean;
    onSelect: () => void;
    onDownloadError: (src: string) => void;
}

function ImageCard(props: Props) {
    const { data, selected, onSelect, onDownloadError } = props;

    return (
        <div className='image-card'>
            <div className={`image-container${selected ? ' selected' : ''}`}>
                <div
                    style={data?.error ? { opacity: '0.5' } : {}}
                    className={`image-container__image`}
                    onClick={onSelect}
                >
                    <img className='image' src={data.src} alt={data.alt} />
                </div>
                <div className='actions-container'>
                    <span
                        className='action-icon'
                        onClick={handleDownLoadImage(data, onDownloadError)}
                    >
                        <DownloadIcon />
                    </span>
                    <a
                        href={data.src}
                        download
                        target='_blank'
                        rel='noreferrer'
                        className='download-link'
                    >
                        <BlankIcon />
                    </a>
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
