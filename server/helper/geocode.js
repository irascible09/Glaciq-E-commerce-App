const axios = require('axios')

const geocodeLocation = async (query) => {
    try {
        const { data } = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'glaciq-app',
                },
            }
        );

        if (!data.length) return null;

        return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
        };
    } catch (err) {
        return null;
    }
};

module.exports = geocodeLocation;
