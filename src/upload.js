import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './upload.css'; // Assume CSS changes are made

function LandingPage() {
    const fileInputRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // For showing a loading spinner

    // AWS S3 Configuration
    const S3_BUCKET = 'myresumebucketnewrahul';
    const REGION = 'us-east-1';
git 
    AWS.config.update({
        accessKeyId: "", // Replace with your AWS Access Key ID
        secretAccessKey: "" // Replace with your AWS Secret Access Key
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
            Key: resumes/${Date.now()}_${file.name},
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

            console.log('File uploaded successfully:', data);
            setUploadedFileName(file.name);
            setUploadedFileUrl(data.Location); // The public URL of the uploaded file
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
            {/* Header Section */}
            <header className="landing-header">
                <div className="logo">Connectify</div>
                <nav className="nav-menu">
                    <button className="upload-btn" onClick={handleUploadClick}>
                        Upload Resume
                    </button>
                </nav>
            </header>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf"
                onChange={handleFileUpload}
            />

            {/* File Upload Section */}
            <section id="upload" className="upload-section">
                <h2>Upload Your Resume</h2>
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
        </div>
    );
}

export default LandingPage;