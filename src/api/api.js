import axios from "axios";
const url = "https://home-of-projects-backend.onrender.com/data";

const convertFilesToBase64 = (files) => {
    return Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error("File is not of type Blob"));
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }));
};

export const createProject = async (project) => {
    console.log(project);
    console.log("Converting files to base64...");
    project.files = await convertFilesToBase64(project.files);
    console.log("Sending data....");
    const response = await axios.post(url, project);
    return response.data;
};