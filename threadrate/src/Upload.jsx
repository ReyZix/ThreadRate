import { useState } from 'react';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Handle image file selection
  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  // Handle post button click
  async function handlePost() {
    if (!image || !subject) {
      alert('Please select an image and enter a subject.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'ThreadRateImages'); // your unsigned preset name

    try {
      // Step 1: Upload image to Cloudinary
      const cloudinaryRes = await fetch(
        'https://api.cloudinary.com/v1_1/dpuk8eew3/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      // Step 2: Post to your backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '685e280d0f06b59ed3286251', // REPLACE THIS ITS HARDCODED RIGHT NOW JUST FOR TESTING
          title: subject,
          description,
          imageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Upload successful!');
        setImage(null);
        setSubject('');
        setDescription('');
      } else {
        alert(result.error || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Upload Image</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div style={{ marginTop: 10 }}>
          <strong>Selected file:</strong> {image.name}
        </div>
      )}

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: '100%', marginTop: 10, padding: '8px' }}
      />

      <textarea
        placeholder="Add a description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: '100%', marginTop: 10, padding: '8px' }}
      />

      <button onClick={handlePost} style={{ marginTop: 10 }}>
        Post
      </button>
    </div>
  );
}
