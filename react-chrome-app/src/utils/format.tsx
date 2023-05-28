import { Image } from '../types';

export const checkImage = (src: string, domain: string, url: string = '') => {
    if (src.includes('base64')) return src;
    if (src.includes('http://') || src.includes('https://')) {
        return src;
    } else {
        let src_ = src.charAt(0) === '/' ? src : '/' + src;
        if (url.includes('http://')) {
            return 'http://' + domain + src_;
        } else if (url.includes('https://')) {
            return 'https://' + domain + src_;
        }
    }
    return '';
};

const getFileName = (url: string) => {
    if (url.includes('data:image')) return 'image.svg';
    const fileName = url?.split('/')?.pop()?.split('#')[0]?.split('?')[0];
    return !fileName
        ? 'image.png'
        : fileName.match(
              /\w+\.(jpg|jpeg|jfif|pjpeg|pjp|gif|apng|png|tif|tiff|bmp|svg|webp|ico|cur|bmp)$/gi
          )
        ? fileName
        : fileName + '.png';
};

export const handleDownLoadImage = (
    item: Image,
    callback: (src: string) => void
) => {
    return () => {
        fetch(item.src, {
            method: 'GET',
            headers: {},
        })
            .then((response) => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement('a');
                    let fileName = getFileName(item.src);
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(() => {
                callback(item.src);
            });
    };
};

export const handleDownloadAllImage = (
    data: string[],
    callback: (item: string) => void
) => {
    return () => {
        data?.forEach((item) => {
            fetch(item, {
                method: 'GET',
                headers: {},
            })
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(
                            new Blob([buffer])
                        );
                        let fileName = getFileName(item);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', fileName);
                        document.body.appendChild(link);
                        link.click();
                    });
                })
                .catch(() => {
                    callback(item);
                });
        });
    };
};

export const extractHostname = (url: string) => {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};
