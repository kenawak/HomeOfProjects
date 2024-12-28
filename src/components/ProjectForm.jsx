import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const validationSchema = yup.object({
  githubLink: yup.string().url('Invalid GitHub link').required('GitHub link is required'),
  linkedinProfile: yup.string().url('Invalid LinkedIn profile link').required('LinkedIn profile link is required'),
  twitterAccount: yup.string().url('Invalid Twitter account link').required('Twitter account link is required'),
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
  const formik = useFormik({
    initialValues: {
      githubLink: '',
      linkedinProfile: '',
      twitterAccount: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted', values);
    },
  });

  return (
    <div className="h-screen bg-white rounded-lg shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
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
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  id="github-link"
                  name="githubLink"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your GitHub Link"
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