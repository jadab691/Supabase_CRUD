import { useState } from 'react';
import './App.css';
import Crud from './Crud';

function App() {
  const [showCrud, setShowCrud] = useState(false);

  if (showCrud) {
    return (
      <div>
        <button onClick={() => setShowCrud(false)}>
          ← Back to Documentation
        </button>
        <Crud />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Supabase TEST API</h1>

      <p>
        This API performs CRUD operations on the Supabase TEST table.
      </p>

      <h2>Base URL</h2>
      <code>
        https://kistmsttylnmaipsbzmo.supabase.co/rest/v1/TEST
      </code>

      <h2>API Endpoints</h2>

      <p><strong>GET</strong> — Retrieve all records</p>
      <code>GET /TEST</code>

      <p><strong>POST</strong> — Create a new record</p>
      <code>POST /TEST</code>

      <p><strong>PATCH</strong> — Update an existing record</p>
      <code>PATCH /TEST?id=eq.1</code>

      <p><strong>DELETE</strong> — Delete a record</p>
      <code>DELETE /TEST?id=eq.1</code>

      <h2>Authentication</h2>
      <p>
        Requests use a Supabase publishable key in the
        <code> apikey </code> header. Table permissions and RLS policies
        control access.
      </p>

      <button onClick={() => setShowCrud(true)}>
        Perform CRUD Operation
      </button>
    </div>
  );
}

export default App;