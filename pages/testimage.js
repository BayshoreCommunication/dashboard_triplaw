"use client";

import AWS from "aws-sdk";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const s3 = new AWS.S3({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    accessKeyId: "DO00HFNWVPYJBRTBVZZJ",
    secretAccessKey: "VTaTd4LASdw+OjDylmiBOPa4GOD956R/25597C7ULX8",
    region: "us-east-1", // Ensure this matches your DigitalOcean Spaces region
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    const uniqueFileName = `${ "trip-law"}/${Date.now()}-${uuidv4()}-${encodeURIComponent(file.name)}`;

    const params = {
      Bucket: "bayshore",
      Key: uniqueFileName,
      Body: file,
      ACL: "public-read",
      ContentType: file.type,
    };

    console.log("Uploading file:",uniqueFileName, params);
    

    try {
      const data = await s3.upload(params).promise();
      console.log("Uploaded File URL:", data.Location);

      setFileUrl(data.Location);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {fileUrl && (
        <div>
          <p>Uploaded File URL:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;