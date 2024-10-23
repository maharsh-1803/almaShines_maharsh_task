const Url = require('../model/url.model');
const QRCode = require('qrcode');
const shortid = require('shortid');

const createShortUrl = async (req, res) => {
    const { longUrl, expirationDate } = req.body;

    try {
        const shortUrlId = shortid.generate();
        const fullUrl = `${req.protocol}://${req.get('host')}/${shortUrlId}`;

        const qrCodeUrl = await QRCode.toDataURL(longUrl);
        const newUrl = new Url({
            longUrl,
            shortUrl: shortUrlId,
            fullShortUrl: fullUrl,
            qrCode: qrCodeUrl,
            expirationDate,
            createdBy: req.user ? req.user.id : null,
        });

        await newUrl.save();
        return res.status(201).json({
            longUrl,
            shortUrl: fullUrl,
            qrCodeUrl,
            expirationDate,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (!url || (url.expirationDate && new Date() > url.expirationDate)) {
            return res.status(404).json({ error: 'URL not found or expired' });
        }

        url.clicks++;
        await url.save();

        const longUrl = url.longUrl.startsWith('http://') || url.longUrl.startsWith('https://')
            ? url.longUrl
            : `http://${url.longUrl}`; 

        return res.redirect(longUrl);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    createShortUrl,
    redirectUrl
};
