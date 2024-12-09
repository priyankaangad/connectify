import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '../css/landingpage.css';

function UploadPage() {
    const fileInputRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // AWS S3 Configuration
    const S3_BUCKET = 'myresumebucketnewrahul';
    const REGION = 'us-east-1';
    const accessKeyId= process.env.REACT_APP_AWS_ACCESS_KEY_ID
    const secretAccessKey= process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    });

    const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
    });

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const params = {
            Bucket: S3_BUCKET,
            Key: `resumes/${Date.now()}_${file.name}`,
            Body: file,
            ACL: 'public-read',
        };

        setIsUploading(true);

        s3.upload(params, (err, data) => {
            setIsUploading(false);

            if (err) {
                console.error('Error uploading file:', err);
                alert('Error uploading file. Please try again.');
                return;
            }

            setUploadedFileName(file.name);
            setUploadedFileUrl(data.Location);
            alert('File uploaded successfully to AWS S3!');
        });
    };

    const renderFilePreview = () => {
        if (!uploadedFileUrl) return null;

        if (uploadedFileName.endsWith('.pdf')) {
            return (
                <div style={{ border: '1px solid #ccc', height: '500px', overflow: 'auto', marginTop: '20px' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer fileUrl={uploadedFileUrl} />
                    </Worker>
                </div>
            );
        } else {
            return <p>Preview is only available for PDFs.</p>;
        }
    };

    return (
        <div className="landing-page">
          

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf"
                onChange={handleFileUpload}
            />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Connectify</h1>
                    <p>Seamlessly manage your resume uploads and access them anytime, anywhere.</p>
                </div>
                <button className="upload-btn" onClick={handleUploadClick}>
                        Upload Resume
                    </button>
            </section>

            {/* File Upload Section */}
            <section id="upload" className="upload-section">
                
                {isUploading ? (
                    <div className="spinner">
                        <p>Uploading...</p>
                        <div className="loading-circle"></div>
                    </div>
                ) : (
                    <>
                        {uploadedFileName && (
                            <div className="uploaded-info">
                                <p>Uploaded File: {uploadedFileName}</p>
                                <a
                                    href={uploadedFileUrl}
                                    download={uploadedFileName}
                                    className="download-btn"
                                >
                                    Download Resume
                                </a>
                            </div>
                        )}
                        <div className="file-preview">{renderFilePreview()}</div>
                    </>
                )}
            </section>

            {/* Footer Section */}
            <footer className="landing-footer">
                <div>© 2024 Connectify. All Rights Reserved.</div>
                <nav className="footer-nav">
                    <ul>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#support">Support</a></li>
                    </ul>
                </nav>
            </footer>
        </div>
    );
}

export default UploadPage;
