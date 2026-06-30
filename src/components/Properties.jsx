import { useState, useEffect } from 'react'

function Properties() {
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'Apartment',
    rent_amount: ''
  })

  useEffect(() => {
    fetchProperties()
  }, [])

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
      const url = editingId ? `/api/properties/${editingId}` : '/api/properties'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchProperties()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving property:', error)
    }
  }

  const handleEdit = (property) => {
    setFormData({
      name: property.name,
      address: property.address,
      type: property.type,
      rent_amount: property.rent_amount
    })
    setEditingId(property.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      fetchProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', address: '', type: 'Apartment', rent_amount: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="properties">
      <div className="page-header">
        <h2>Properties</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Property' : 'Add New Property'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Property Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Condo">Condo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Monthly Rent</label>
              <input
                type="number"
                step="0.01"
                value={formData.rent_amount}
                onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
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
              <th>Address</th>
              <th>Type</th>
              <th>Rent</th>
              <th>Tenants</th>
              <th>Total Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.name}</td>
                <td>{property.address}</td>
                <td>{property.type}</td>
                <td>{formatCurrency(property.rent_amount)}</td>
                <td>{property.tenant_count}</td>
                <td>{formatCurrency(property.total_revenue)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(property)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-small btn-delete"
                      onClick={() => handleDelete(property.id)}
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

export default Properties
