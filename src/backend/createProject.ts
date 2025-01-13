import { API_BASE_URL } from './constants';
import type { Project } from './types';

export const createProject = async ({
    apiKey,
    workspaceId,
    projectName,
}: {
    apiKey: string;
    workspaceId: string;
    projectName: string | null;
}) => {
    const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/projects/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
        },
        body: JSON.stringify({
            name: projectName,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to create project');
    }

    const projectResponse = await res.json();
    return projectResponse as Project;
};
