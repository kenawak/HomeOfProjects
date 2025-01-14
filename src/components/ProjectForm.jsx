import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { createProject } from '../api/api';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import Message from './Message';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageEdit);

const validationSchema = yup.object({
  projectName: yup.string().required('Project name is required'),
  projectDescription: yup.string().required('Project description is required'),
  linkedinProfile: yup.string().url('Invalid LinkedIn profile link').optional(),
  twitterAccount: yup
    .string()
    .matches(/^@/, 'Twitter username must start with @')
    .required('Twitter username is required'),
    telegramUsername: yup
    .string()
    .matches(/^@/, '@john_doe')
    .required('Telegram username is required'),
    githubLink: yup
    .string()
    .matches(/https:\/\/github\.com\/.+/, 'Input a valid github link/')
    .optional(),
  liveLink: yup
    .string()
    .matches(/^https?:\/\/.+/, 'Live project link must be a valid URL')
    .optional(),
});
const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
);
const Uploader = ({ setFieldValue }) => {
  const [files, setFiles] = useState([]);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const link = document.createElement('a');
      link.href = e.target.result;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={(fileItems) => {
          const updatedFiles = fileItems.map(fileItem => fileItem.file);
          setFiles(updatedFiles);
          setFieldValue('files', updatedFiles);
        }}
        allowMultiple={true}
        maxFiles={3}
        acceptedFileTypes={['image/*']}
        name="files"
        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        onprocessfile={(error, file) => {
          if (!error) {
            handleUpload(file.file);
          }
        }}
      />
    </div>
  );
};

const ProjectForm = () => {
  const [useGithubData, setUseGithubData] = useState(false);
  const [status, setStatus] = useState(null);

  const formik = useFormik({
    initialValues: {
      projectName: '',
      projectDescription: '',
      linkedinProfile: '',
      twitterAccount: '',
      telegramUsername: '',
      githubLink: '',
      liveLink: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("sending....")
        setStatus({ type: 'loading', message: 'Sending data...' });
        const response = await createProject(values);
        console.log('Form submitted', response.data);
        setStatus({ type: 'success', message: 'Data sent successfully' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Error `sen`ding data' });
        console.error('Error submitting form', error);
      }
    },
  });

  const handleCheckboxChange = async (e) => {
    setUseGithubData(e.target.checked);
    if (e.target.checked && formik.values.githubLink) {
      try {
        const githubUrl = formik.values.githubLink; // User-provided GitHub URL

    // Validate and parse the GitHub URL
    const match = githubUrl.match(/https:\/\/github\.com\/repos\/([^\/]+)\/([^\/]+)/);
    if (!match) {
        setStatus({ type: 'error', message: 'Invalid GitHub URL. Please provide a valid repository link.' });
        return;
    }

    const username = match[1]; // Extracted username
    console.log(username)
    const repoName = match[2]; // Extracted repository name
    console.log(repoName)
    // Fetch repository details from the GitHub API
    setStatus({ type: 'loading', message: 'Fetching GitHub data...' });
    const githubResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
    console.log('GitHub data', githubResponse.data);
    // Update form fields with fetched data
    formik.setFieldValue('projectDescription', githubResponse.data.description || 'No description available');
    formik.setFieldValue('projectName', githubResponse.data.name || 'No name available');
    setStatus({ type: 'success', message: 'GitHub data set successfully' });
      } catch (error) {
        console.error('Error fetching GitHub data', error);
        setStatus({ type: 'error', message: 'Error fetching GitHub data' });
      }
    }
  };

  return (
    <div className="h-auto bg-white rounded-lg shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden lg:overflow-visible">

      <div className="px-4 py-8 sm:px-10">
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-2 text-gray-500 bg-white">Home Of Projects</span>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="w-full space-y-6">
          {!useGithubData && (
              <>
              <div className="w-full">
                <label htmlFor="project-name" className="block text-gray-700">Project Name</label>
                <div className="relative">
                    <input
                      type="text"
                      id="project-name"
                      name="projectName"
                      className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Project Name"
                      value={formik.values.projectName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.projectName && formik.errors.projectName && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.projectName}</p>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="project-description" className="block text-gray-700">Project Description</label>
                  <div className="relative">
                    <textarea
                      id="project-description"
                      name="projectDescription"
                      className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Describe your project"
                      value={formik.values.projectDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.projectDescription && formik.errors.projectDescription && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.projectDescription}</p>
                    )}
                  </div>
              </div>
              </>
            )}
       
            <div className="flex items-center space-x-2">
              <input
                id="use-github-data"
                type="checkbox"
                checked={useGithubData}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label htmlFor="use-github-data" className="text-gray-700 font-medium">
                Use GitHub data for project description
              </label>
            </div>
            <div className="w-full">
              <label htmlFor="github-link" className="block text-gray-700">GitHub Link (optional)</label>
              <div className="relative">
                <input
                  type="text"
                  id="github-link"
                  name="githubLink"
                  className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your GitHub Link (optional)"
                  value={formik.values.githubLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.githubLink && formik.errors.githubLink && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.githubLink}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="live-link" className="block text-gray-700">Live Project Link (optional)</label>
              <div className="relative">
                <input
                  type="text"
                  id="live-link"
                  name="liveLink"
                  className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your Live Project Link (optional)"
                  value={formik.values.liveLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.liveLink && formik.errors.liveLink && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.liveLink}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="linkedin-profile" className="block text-gray-700">LinkedIn Profile</label>
              <div className="relative">
                <input
                  type="text"
                  id="linkedin-profile"
                  name="linkedinProfile"
                  className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your LinkedIn Profile"
                  value={formik.values.linkedinProfile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.linkedinProfile && formik.errors.linkedinProfile && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.linkedinProfile}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="twitter-account" className="block text-gray-700">X/Twitter Account</label>
              <div className="relative">
                <input
                  type="text"
                  id="twitter-account"
                  name="twitterAccount"
                  className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your X/Twitter account"
                  value={formik.values.twitterAccount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.twitterAccount && formik.errors.twitterAccount && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.twitterAccount}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="telegram-username" className="block text-gray-700">Telegram Account</label>
              <div className="relative">
                <input
                  type="text"
                  id="telegram-username"
                  name="telegramUsername"
                  className="rounded-lg border border-gray-300 flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your Telegram Username"
                  value={formik.values.telegramUsername}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.telegramUsername && formik.errors.telegramUsername && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.telegramUsername}</p>
                )}
              </div>
            </div>
            <Uploader setFieldValue={formik.setFieldValue} />
            <div>
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Upload My Project
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
      {status && status.type === 'loading' && <Loader />}
      {status && status.type !== 'loading' && <Message type={status.type} message={status.message} />}

    </div>
  );
};

export default ProjectForm;