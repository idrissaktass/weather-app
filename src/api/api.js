import axios from 'axios';

const API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export const fetchData = async (location) => {
  try {
    const queryParams = new URLSearchParams({
      // key: "HNDAG4NJCW27DUTLVYKC8YD3E",
      key: "TLMXZQLJF9TLVTXCLJN7AS36M",
    }).toString();

    const response = await axios.get(`${API_URL}/${location}?${queryParams}`);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('There was a problem fetching data');
  }
};
