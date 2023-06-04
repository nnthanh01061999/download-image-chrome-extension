interface Props {
    src: string;
}

function VideoCard(props: Props) {
    const { src } = props;
    return (
        <div className='image-card'>
            <video src={src} controls width='280' height='210' />
        </div>
    );
}

export default VideoCard;
