import axios from 'axios';

const API_URL = 'http://localhost:3000/prompts';

export const getPrompts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return [];
    }
};

export const createPrompt = async (promptData) => {
    try {
        const response = await axios.post(API_URL, promptData);
        return response.data;
    } catch (error) {
        console.error('Error creating prompt:', error);
        return null;
    }
};