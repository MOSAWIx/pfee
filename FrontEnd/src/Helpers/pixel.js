import ReactPixel from 'react-facebook-pixel';

// Track ViewContent event
export const trackViewContent = (content) => {
    ReactPixel.track('ViewContent', content);
};

// Track Lead event
export const trackLead = (leadData) => {
    ReactPixel.track('Lead', leadData);
};