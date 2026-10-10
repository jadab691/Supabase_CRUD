import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function Crud() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function fetchItems() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('TEST')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function resetForm() {
    setTitle('');
    setDescription('');
    setImage('');
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const record = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
    };

    let result;

    if (editingId !== null) {
      result = await supabase
        .from('TEST')
        .update(record)
        .eq('id', editingId)
        .select();
    } else {
      result = await supabase
        .from('TEST')
        .insert([record])
        .select();
    }

    if (result.error) {
      setError(result.error.message);
    } else if (!result.data || result.data.length === 0) {
      setError(
        'No record was returned. Check your RLS policies and table permissions.'
      );
    } else {
      setMessage(
        editingId !== null
          ? 'Record updated successfully!'
          : 'Record created successfully!'
      );

      resetForm();
      await fetchItems();
    }

    setSaving(false);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setImage(item.image || '');

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    setError('');
    setMessage('');

    const { data, error } = await supabase
      .from('TEST')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      setError(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        'No record was deleted. Check the ID, RLS policies, and permissions.'
      );
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage('Record deleted successfully!');
    await fetchItems();
  }

  return (
    <section className="crud-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">INTERACTIVE PLAYGROUND</p>
          <h2 className="section-title">CRUD Operations</h2>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={fetchItems}
        >
          Refresh records
        </button>
      </div>

      <p className="muted">
        Create, read, update, and delete records from your Supabase TEST table.
      </p>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="crud-form" onSubmit={handleSubmit}>
        <h3>{editingId !== null ? 'Update Record' : 'Create Record'}</h3>

        <label htmlFor="title">Title *</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter title"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter description"
          rows={3}
        />

        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://example.com/image.jpg"
        />

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId !== null
                ? 'Update Record'
                : 'Create Record'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="records-heading">
        <h3>Records</h3>
        <span>{items.length} total</span>
      </div>

      {loading ? (
        <p className="muted">Loading records...</p>
      ) : items.length === 0 ? (
        <p className="empty-state">No records found. Create your first one!</p>
      ) : (
        <div className="records-grid">
          {items.map((item) => (
            <article className="record-card" key={item.id}>
              {item.image && (
                <img
                  className="record-image"
                  src={item.image}
                  alt={item.title || 'Record image'}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <p className="record-id">ID: {item.id}</p>
              <h4>{item.title}</h4>
              <p>{item.description || 'No description provided.'}</p>

              <div className="record-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Crud;