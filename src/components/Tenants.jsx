import { useState, useEffect } from 'react'

function Tenants() {
  const [tenants, setTenants] = useState([])
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_id: '',
    lease_start: '',
    lease_end: ''
  })

  useEffect(() => {
    fetchTenants()
    fetchProperties()
  }, [])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants')
      const data = await response.json()
      setTenants(data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/tenants/${editingId}` : '/api/tenants'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchTenants()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving tenant:', error)
    }
  }

  const handleEdit = (tenant) => {
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      property_id: tenant.property_id,
      lease_start: tenant.lease_start,
      lease_end: tenant.lease_end
    })
    setEditingId(tenant.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return
    
    try {
      await fetch(`/api/tenants/${id}`, { method: 'DELETE' })
      fetchTenants()
    } catch (error) {
      console.error('Error deleting tenant:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      property_id: '',
      lease_start: '',
      lease_end: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="tenants">
      <div className="page-header">
        <h2>Tenants</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Tenant'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Tenant' : 'Add New Tenant'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Property</label>
              <select
                value={formData.property_id}
                onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                required
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Lease Start Date</label>
              <input
                type="date"
                value={formData.lease_start}
                onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Lease End Date</label>
              <input
                type="date"
                value={formData.lease_end}
                onChange={(e) => setFormData({ ...formData, lease_end: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Lease Start</th>
              <th>Lease End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.name}</td>
                <td>{tenant.email}</td>
                <td>{tenant.phone}</td>
                <td>{tenant.property_name || 'N/A'}</td>
                <td>{formatDate(tenant.lease_start)}</td>
                <td>{formatDate(tenant.lease_end)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(tenant)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-small btn-delete"
                      onClick={() => handleDelete(tenant.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tenants
