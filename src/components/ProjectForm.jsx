import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
// import { createProject } from '../api/api'; // Commented out as it's not used

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageEdit);

const validationSchema = yup.object({
  projectName: yup.string().required('Project name is required'),
  projectDescription: yup.string().required('Project description is required'),
  telegramLink: yup.string().url('Invalid Telegram link').required('Telegram link is required'),
  linkedinProfile: yup.string().url('Invalid LinkedIn profile link').required('LinkedIn profile link is required'),
  twitterAccount: yup.string().url('Invalid Twitter account link').required('Twitter account link is required'),
  githubLink: yup.string().url('Invalid GitHub link').optional(),
  liveLink: yup.string().url('Invalid live project link').optional(),
});

const Uploader = ({ setFieldValue }) => {
  const [files, setFiles] = useState([]);

  const handleDownload = (file) => {
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
          setFiles(fileItems.map(fileItem => fileItem.file));
          setFieldValue('files', fileItems.map(fileItem => fileItem.file));
        }}
        allowMultiple={true}
        maxFiles={3}
        acceptedFileTypes={['image/*']} // Accept only images
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        action='/'
        imageEditEditor={false}        
      />
      {files.map((file, index) => (
        <button
          key={index}
          onClick={() => handleDownload(file)}
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-2"
        >
          Download {file.name}
        </button>
      ))}
    </div>
  );
};

const ProjectForm = () => {
  const [useGithubData, setUseGithubData] = useState(false);

  const formik = useFormik({
    initialValues: {
      projectName: '',
      projectDescription: '',
      telegramLink: '',
      linkedinProfile: '',
      twitterAccount: '',
      githubLink: '',
      liveLink: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(process.env.API_URL, values);
        console.log('Form submitted', response.data);
      } catch (error) {
        console.error('Error submitting form', error);
      }
    },
  });

  const handleCheckboxChange = async (e) => {
    setUseGithubData(e.target.checked);
    if (e.target.checked && formik.values.githubLink) {
      try {
        const githubResponse = await axios.get(`https://api.github.com/repos/${formik.values.githubLink}`);
        formik.setFieldValue('projectDescription', githubResponse.data.description);
        formik.setFieldValue('projectName', githubResponse.data.title);
      } catch (error) {
        console.error('Error fetching GitHub data', error);
      }
    }
  };

  return (
    <div className="h-screen bg-white rounded-lg shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden lg:overflow-visible">
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
                  <div className="relative">
                    <input
                      type="text"
                      id="project-name"
                      name="projectName"
                      className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  <div className="relative">
                    <textarea
                      id="project-description"
                      name="projectDescription"
                      className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              <div className="relative">
                <input
                  type="text"
                  id="telegram-link"
                  name="telegramLink"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your Telegram Link"
                  value={formik.values.telegramLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.telegramLink && formik.errors.telegramLink && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.telegramLink}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  id="linkedin-profile"
                  name="linkedinProfile"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              <div className="relative">
                <input
                  type="text"
                  id="twitter-account"
                  name="twitterAccount"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              <div className="relative">
                <input
                  type="text"
                  id="github-link"
                  name="githubLink"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              <div className="relative">
                <input
                  type="text"
                  id="live-link"
                  name="liveLink"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
            <Uploader setFieldValue={formik.setFieldValue} />
            <div>
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Send
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
      <div className="px-4 py-6 border-t-2 border-gray-200 bg-gray-50 sm:px-10">
        <p className="text-xs leading-5 text-gray-500">
          This data will be sent to the Channel
        </p>
      </div>
    </div>
  );
};

export default ProjectForm;