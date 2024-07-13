import React, { useState } from 'react';
import { Sun, Moon, Upload, FileText, Download, Linkedin, Github, Mail, Twitter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const DocPadApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
      setUploadStatus(null);
      setGeneratedPdf(null);
    } else {
      setFile(null);
      setUploadStatus('error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      setUploadStatus('processing');
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const pdfBlob = await response.blob();
        console.log('PDF Blob:', pdfBlob);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log('PDF URL:', pdfUrl);
        
        
        setGeneratedPdf(pdfUrl);
        setUploadStatus('success');
      
      } catch (error) {
        console.error('Error:', error);
        setUploadStatus('error');
      }
    }
  };

  return (
<div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <style jsx="true">{`
        .gradient-shadow {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.2), 0 0 30px rgba(192, 38, 211, 0.1);
        }
        .gradient-shadow:hover {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(192, 38, 211, 0.2);
        }
        .dark .gradient-shadow {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(192, 38, 211, 0.6);
        }
        .dark .gradient-shadow:hover {
          box-shadow: 0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(192, 38, 211, 0.8);
        }
      `}</style>
       
      <div className="container mx-auto px-4 pt-[6rem] pb-[2rem] flex-grow">
        <header className="flex justify-between items-center mb-7 mx-[1rem]">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              DocPad
            </h1>
            <p className={`mt-1 text-lg font-serif md:text-xl font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
              Unlock the power of your documents
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <main>
          <section className="mb-8">
            <h2 className="mx-[1rem] text-2xl mt-[5rem] font-semibold mb-1  bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">Extract Highlights with Ease</h2>
            <p className="mx-[1rem] text-[18px] md:text-lg mb-4 font-mono">Upload your PDF or DOCX files and let <strong>DocPad</strong> do the magic!</p>
            <form onSubmit={handleSubmit} className="space-y-2 mt-[2px] md:mx-[6rem] xl:mx-[10rem]">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-64 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}
                    transition-all duration-300 ease-in-out
                    gradient-shadow
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs font-bold">( .pdf or .docx )</p>
                  </div>
                  <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                </label>
              </div>
              {file && (
                <div className={`flex items-center space-x-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <FileText size={20} />
                  <span>{file.name}</span>
                </div>
              )}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded font-semibold font-serif ${
                  file
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-red-200 text-gray-950 cursor-not-allowed'
                }`}
                disabled={!file || uploadStatus === 'processing'}
              >
                {uploadStatus === 'processing' ? 'Processing...' : 'Extract Highlights'}
              </button>
            </form>
          </section>

          {uploadStatus === 'success' && generatedPdf && (
            <section className=" mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Generated PDF</h2>
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                <a
                  href={generatedPdf}
                  download="Summary.pdf"
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-full
                    bg-gradient-to-r from-purple-500 to-pink-500 
                    hover:from-purple-600 hover:to-pink-600
                    text-white font-semibold shadow-lg
                    transform transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                  `}
                >
                  <Download size={20} />
                  <span>Download PDF</span>
                </a>
              </div>
              </div>
            </section>
          )}



           {uploadStatus === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Processing Failed</AlertTitle>
              <AlertDescription>
                An error occurred while processing your file. Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>         
           )} 
        </main>
      </div>

      <footer className={`mt-auto py-6 pt-[3rem]  ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4 justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="https://www.linkedin.com/in/mitumoni-kalita-55516920a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/mitumoni-k" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
                <Github size={24} />
              </a>
              <a href="mailto:mitumonikalita2002@gmail.com" className="hover:text-red-500">
                <Mail size={24} />
              </a>
              <a href="https://x.com/kalita_mitu18" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <Twitter size={24} />
              </a>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-900'} font-semibold`}>
              © {new Date().getFullYear()} DocPad. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};


export default DocPadApp;

