
const canonicalUrl = 
    (url) => !url.match(/https?:\/\/opensource.org/) ? `https://opensource.org${url}` : url;

module.exports = canonicalUrl;