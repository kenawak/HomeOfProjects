import axios from axios

export const createProject = async (project) => {
    const response = await axios.post('http://localhost:1337/projects', project);
    return response.data;
}