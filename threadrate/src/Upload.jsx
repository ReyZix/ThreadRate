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
  function handlePost() {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    // For demo, just log the data
    console.log('Posting image:', image);
    console.log('Subject:', subject);
    console.log('Description:', description);

    // upload the image and description here

    alert('Posted!');
    setImage(null);
    setDescription('');
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
        onChange={e => setSubject(e.target.value)}
        style={{ width: '100%', marginTop: 10, padding: '8px' }}
      />

      <textarea
        placeholder="Add a description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={4}
        style={{ width: '100%', marginTop: 10, padding: '8px' }}
      />

      <button onClick={handlePost} style={{ marginTop: 10 }}>
        Post
      </button>
    </div>
  );
}
