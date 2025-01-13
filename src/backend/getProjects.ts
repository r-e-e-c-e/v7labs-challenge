import { API_BASE_URL } from './constants';
import type { Project } from './types';

export const getProjects = async ({ apiKey, workspaceId }: { workspaceId: string; apiKey: string }) => {
    const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }

    const projectsResponse: { data: Project[]; metadata: Record<string, unknown> } = await res.json();
    return projectsResponse.data;
};
