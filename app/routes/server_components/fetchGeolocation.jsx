import fetch from 'node-fetch';

export async function fetchGeolocation(ipAddress) {
  try {
    const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      if (geoData.status === 'success') {
        return { country: geoData.country, city: geoData.city, timezone: geoData.timezone, stateOrProvince: geoData.region, countryCode: geoData.countryCode, };
      } else {
        throw new Error(geoData.message);
      }
    } else {
      throw new Error('Failed to fetch geolocation data');
    }
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return { error: 'Error fetching geolocation data' };
  }
}
