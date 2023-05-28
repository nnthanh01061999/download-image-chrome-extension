import { Image } from './';

export type DOMMessage = {
    type: 'GET_DOM';
};

export type DOMMessageResponse = {
    images: Image[];
};
