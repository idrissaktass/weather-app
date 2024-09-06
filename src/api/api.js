import axios from 'axios';

const API_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

export const fetchData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      key: process.env.REACT_APP_API_KEY
    }).toString();

    const response = await axios.get(`${API_URL}?${queryParams}`);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    throw new Error('There was a problem fetching data');
  }
};
