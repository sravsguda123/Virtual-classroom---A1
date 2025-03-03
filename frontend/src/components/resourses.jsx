import { useState, useEffect } from "react";
import axios from "axios";

export default function ResourceSharing() {
  const [searchTags, setSearchTags] = useState("");
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSearch = async () => {
    try {
      const tagsArray = searchTags.split(",").map(tag => tag.trim());
  
      const response = await axios.get("http://127.0.0.1:8000/search", {
        params: { tags: tagsArray },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        },
      });
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setResources([]);
    }
  };
  

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || "");  // Ensure it's a string
      formData.append("description", description || "");  // Ensure it's a string
  
      console.log("Sending description:", description); // Debugging
  
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("File uploaded successfully");
      console.log("Tags:", response.data.tags);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resource Sharing</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter tags (comma separated)"
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>

      <div className="space-y-2">
        {resources.map((res, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{res.title}</h2>
            <p>{res.description}</p>
            <p className="text-sm text-gray-500">Tags: {res.tags.join(", ")}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 border p-4 rounded">
        <h2 className="text-xl font-bold">Upload Resource</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded w-full" />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleUpload} className="bg-green-500 text-white p-2 rounded">
          Upload
        </button>
      </div>
    </div>
  );
}
