import React, { useEffect, useState } from 'react';
import { getPrompts } from '../../services/api';

const PromptList = () => {
    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            const data = await getPrompts();
            setPrompts(data);
        };
        fetchPrompts();
    }, []);

    return (
        <div>
            <h1>Story Prompts</h1>
            <ul>
                {prompts.map((prompt) => (
                    <li key={prompt.id}>
                        <h2>{prompt.title}</h2>
                        <p>{prompt.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PromptList;