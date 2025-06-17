// hooks/useFacebookPixel.js
import { useEffect, useRef } from 'react';
import ReactPixel from 'react-facebook-pixel';
import axios from 'axios';
import  WebAxiosConfig from '../config/webAxiosConfig';
import { parse } from 'postcss';

const useFacebookPixel = () => {
    const isInitialized = useRef(false);

    useEffect(() => {
        const initPixel = async () => {
            try {
                const res = await WebAxiosConfig.get('facebookPixel');

                const pixelId = res.data.data.facebookPixelId
                const isActive = res.data.data.active;
                console.log('Facebook Pixel ID:', pixelId);
                console.log('Is Facebook Pixel Active:', isActive);

                if (pixelId && isActive && !isInitialized.current) {
                    ReactPixel.init(parseInt(pixelId, 10), {
                        autoConfig: true,
                        debug: true
                    });
                    ReactPixel.pageView();
                    isInitialized.current = true;
                }
            } catch (error) {
                console.error('Failed to load Facebook Pixel:', error);
            }
        };

        initPixel();
    }, []);
};

export default useFacebookPixel;
