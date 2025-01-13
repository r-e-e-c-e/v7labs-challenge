import { API_BASE_URL } from './constants';
import type { Project } from './types';

export const renameProject = async ({
    apiKey,
    workspaceId,
    projectId,
    newProjectName,
}: {
    apiKey: string;
    workspaceId: string;
    projectId: string;
    newProjectName: string | null;
}) => {
    const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
        },
        body: JSON.stringify({
            name: newProjectName,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to rename project');
    }

    const projectResponse = await res.json();
    return projectResponse as Project;
};
