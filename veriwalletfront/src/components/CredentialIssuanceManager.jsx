import React, { useState, useEffect } from 'react';

const CredentialIssuanceManager = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'identity',
    airkitSchemaId: '',
    airkitSchemaName: '',
    airkitSchemaJson: '',
    airkitIssuanceProgramId: '',
    airkitIssuerDid: '',
    issuanceUrl: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // دسته‌بندی‌ها
  const categories = [
    { value: 'identity', label: 'Identity', color: 'blue', icon: '🆔' },
    { value: 'defi', label: 'DeFi', color: 'green', icon: '💰' },
    { value: 'work', label: 'Work', color: 'purple', icon: '💼' },
    { value: 'education', label: 'Education', color: 'yellow', icon: '🎓' },
    { value: 'health', label: 'Health', color: 'red', icon: '🏥' },
    { value: 'finance', label: 'Finance', color: 'emerald', icon: '🏦' },
    { value: 'government', label: 'Government', color: 'gray', icon: '🏛️' },
    { value: 'other', label: 'Other', color: 'orange', icon: '🔮' }
  ];

  // وضعیت‌ها
  const statusTypes = [
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'published', label: 'Published', color: 'green' }
  ];

  // بارگذاری سرویس‌ها از سرور
  useEffect(() => {
    //fetchServices();
        fetch('/mock-data/credential-services.json')
    .then(response => response.json())
    .then(data => setServices(data.credentialServices));
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/credential-services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.airkitSchemaId.trim()) newErrors.airkitSchemaId = 'Schema ID is required';
    if (!formData.airkitSchemaName.trim()) newErrors.airkitSchemaName = 'Schema Name is required';
    
    // Validate JSON
    if (!formData.airkitSchemaJson.trim()) {
      newErrors.airkitSchemaJson = 'Schema JSON is required';
    } else {
      try {
        JSON.parse(formData.airkitSchemaJson);
      } catch (e) {
        newErrors.airkitSchemaJson = 'Invalid JSON format';
      }
    }
    
    if (!formData.airkitIssuanceProgramId.trim()) newErrors.airkitIssuanceProgramId = 'Program ID is required';
    if (!formData.airkitIssuerDid.trim()) newErrors.airkitIssuerDid = 'Issuer DID is required';
    if (!formData.issuanceUrl.trim()) newErrors.issuanceUrl = 'Issuance URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/credential-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          id: '',
          title: '',
          category: 'identity',
          airkitSchemaId: '',
          airkitSchemaName: '',
          airkitSchemaJson: '',
          airkitIssuanceProgramId: '',
          airkitIssuerDid: '',
          issuanceUrl: '',
          status: 'draft'
        });
        setShowForm(false);
        setErrors({});
        fetchServices(); // Reload the list
      } else {
        console.error('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseSchemaProperties = (schemaJson) => {
    try {
      console.log(schemaJson);
      const schema = JSON.parse(schemaJson);
      if (schema.properties && 
          schema.properties.credentialSubject && 
          schema.properties.credentialSubject.properties) {
        return schema.properties.credentialSubject.properties;
      }
      return {};
    } catch (error) {
      console.error('Error parsing schema JSON:', error);
      return {};
    }
  };

  const updateServiceStatus = async (serviceId, newStatus) => {
    try {
      const response = await fetch(`/api/credential-services/${serviceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchServices(); // Refresh the list
      } else {
        console.error('Failed to update service status');
      }
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const getStatusColor = (status) => {
    const statusObj = statusTypes.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(cat => {
      stats[cat.value] = services.filter(s => s.category === cat.value).length;
    });
    return stats;
  };

  const getStatusStats = () => {
    const stats = {};
    statusTypes.forEach(status => {
      stats[status.value] = services.filter(s => s.status === status.value).length;
    });
    return stats;
  };

  const filteredServices = services.filter(service => {
    const categoryMatch = filterCategory === 'all' || service.category === filterCategory;
    const statusMatch = filterStatus === 'all' || service.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const categoryStats = getCategoryStats();
  const statusStats = getStatusStats();

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Credential Issuance Services</h1>
          <p className="mt-2 text-lg text-gray-400">
            Manage your credential issuance services and their properties
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Service
              </button>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">Category:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-40 pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all" className="bg-gray-700">All Categories</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value} className="bg-gray-700">
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-32 pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all" className="bg-gray-700">All Status</option>
                    {statusTypes.map(status => (
                      <option key={status.value} value={status.value} className="bg-gray-700">
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{services.length}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{statusStats.published || 0}</div>
                <div className="text-gray-500">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{statusStats.draft || 0}</div>
                <div className="text-gray-500">Draft</div>
              </div>
            </div>
          </div>

          {/* Category & Status Stats */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Services by Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <div
                      key={category.value}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-${category.color}-900 bg-opacity-50 border border-${category.color}-700 cursor-pointer transition-all duration-200 hover:bg-opacity-70 ${
                        filterCategory === category.value ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : ''
                      }`}
                      onClick={() => setFilterCategory(category.value)}
                    >
                      <span className="text-sm">{category.icon}</span>
                      <span className={`text-sm font-medium text-${category.color}-300`}>
                        {category.label}
                      </span>
                      <span className={`text-xs text-${category.color}-200 bg-${category.color}-800 bg-opacity-50 px-2 py-1 rounded-full`}>
                        {categoryStats[category.value] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Services by Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusTypes.map(status => (
                    <div
                      key={status.value}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-${status.color}-900 bg-opacity-50 border border-${status.color}-700 cursor-pointer transition-all duration-200 hover:bg-opacity-70 ${
                        filterStatus === status.value ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : ''
                      }`}
                      onClick={() => setFilterStatus(status.value)}
                    >
                      <span className={`text-sm font-medium text-${status.color}-300`}>
                        {status.label}
                      </span>
                      <span className={`text-xs text-${status.color}-200 bg-${status.color}-800 bg-opacity-50 px-2 py-1 rounded-full`}>
                        {statusStats[status.value] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Service Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Add New Credential Service</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* ID Field */}
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">
                      Service ID *
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.id ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter unique service ID"
                    />
                    {errors.id && (
                      <p className="mt-1 text-sm text-red-400">{errors.id}</p>
                    )}
                  </div>
                  
                  {/* Title Field */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter service title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                    )}
                  </div>
                  
                  {/* Category Field */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Field */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusTypes.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Schema ID Field */}
                  <div>
                    <label htmlFor="airkitSchemaId" className="block text-sm font-medium text-gray-300 mb-2">
                      AirKit Schema ID *
                    </label>
                    <input
                      type="text"
                      id="airkitSchemaId"
                      name="airkitSchemaId"
                      value={formData.airkitSchemaId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.airkitSchemaId ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter schema ID"
                    />
                    {errors.airkitSchemaId && (
                      <p className="mt-1 text-sm text-red-400">{errors.airkitSchemaId}</p>
                    )}
                  </div>
                  
                  {/* Schema Name Field */}
                  <div>
                    <label htmlFor="airkitSchemaName" className="block text-sm font-medium text-gray-300 mb-2">
                      AirKit Schema Name *
                    </label>
                    <input
                      type="text"
                      id="airkitSchemaName"
                      name="airkitSchemaName"
                      value={formData.airkitSchemaName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.airkitSchemaName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter schema name"
                    />
                    {errors.airkitSchemaName && (
                      <p className="mt-1 text-sm text-red-400">{errors.airkitSchemaName}</p>
                    )}
                  </div>
                  
                  {/* Program ID Field */}
                  <div>
                    <label htmlFor="airkitIssuanceProgramId" className="block text-sm font-medium text-gray-300 mb-2">
                      Issuance Program ID *
                    </label>
                    <input
                      type="text"
                      id="airkitIssuanceProgramId"
                      name="airkitIssuanceProgramId"
                      value={formData.airkitIssuanceProgramId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.airkitIssuanceProgramId ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter program ID"
                    />
                    {errors.airkitIssuanceProgramId && (
                      <p className="mt-1 text-sm text-red-400">{errors.airkitIssuanceProgramId}</p>
                    )}
                  </div>
                  
                  {/* Issuer DID Field */}
                  <div>
                    <label htmlFor="airkitIssuerDid" className="block text-sm font-medium text-gray-300 mb-2">
                      Issuer DID *
                    </label>
                    <input
                      type="text"
                      id="airkitIssuerDid"
                      name="airkitIssuerDid"
                      value={formData.airkitIssuerDid}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.airkitIssuerDid ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter issuer DID"
                    />
                    {errors.airkitIssuerDid && (
                      <p className="mt-1 text-sm text-red-400">{errors.airkitIssuerDid}</p>
                    )}
                  </div>
                  
                  {/* Issuance URL Field */}
                  <div className="md:col-span-2">
                    <label htmlFor="issuanceUrl" className="block text-sm font-medium text-gray-300 mb-2">
                      Issuance URL *
                    </label>
                    <input
                      type="url"
                      id="issuanceUrl"
                      name="issuanceUrl"
                      value={formData.issuanceUrl}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.issuanceUrl ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="https://example.com/issue"
                    />
                    {errors.issuanceUrl && (
                      <p className="mt-1 text-sm text-red-400">{errors.issuanceUrl}</p>
                    )}
                  </div>
                  
                  {/* Schema JSON Field */}
                  <div className="md:col-span-2">
                    <label htmlFor="airkitSchemaJson" className="block text-sm font-medium text-gray-300 mb-2">
                      AirKit Schema JSON *
                    </label>
                    <textarea
                      id="airkitSchemaJson"
                      name="airkitSchemaJson"
                      value={formData.airkitSchemaJson}
                      onChange={handleInputChange}
                      rows={8}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                        errors.airkitSchemaJson ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder='Paste your schema JSON here (must include "credentialSubject" properties)'
                    />
                    {errors.airkitSchemaJson && (
                      <p className="mt-1 text-sm text-red-400">{errors.airkitSchemaJson}</p>
                    )}
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors duration-200"
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Service'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          {loading && services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-400">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-600">📋</div>
              <h3 className="text-lg font-medium text-white mb-2">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'No services found' 
                  : 'No services found with selected filters'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'Get started by creating your first credential issuance service.' 
                  : 'Try changing your filters or create a new service.'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Create First Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:border-gray-500"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">{service.title}</h3>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(service.status)}-900 bg-opacity-50 text-${getStatusColor(service.status)}-300`}
                        >
                          {service.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(service.category)}-900 bg-opacity-50 text-${getCategoryColor(service.category)}-300`}
                        >
                          {categories.find(c => c.value === service.category)?.icon} {categories.find(c => c.value === service.category)?.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 font-mono">ID: {service.id}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-400">Schema ID:</span>
                        <p className="text-white">{service.airkit_schema_id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Schema Name:</span>
                        <p className="text-white">{service.airkit_schema_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Program ID:</span>
                        <p className="text-white">{service.airkit_issuance_program_id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Issuer DID:</span>
                        <p className="text-white font-mono text-xs break-all">{service.airkit_issuer_did}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Issuance URL:</span>
                        <a
                          href={service.issuance_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 break-all transition-colors duration-200"
                        >
                          {service.issuance_url}
                        </a>
                      </div>
                    </div>
                    
                    {/* Credential Properties */}
                    <div className="border-t border-gray-600 pt-4">
                      <h4 className="text-sm font-medium text-white mb-3">Credential Properties</h4>
                      <div className="space-y-2">
                        {Object.entries(parseSchemaProperties(service.airkit_schema_json)).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 bg-gray-600 rounded-lg"
                          >
                            <span className="font-medium text-white text-sm">{key}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-300">{value.title || 'No title'}</span>
                              <span
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-900 bg-opacity-50 text-blue-300"
                              >
                                {value.type || 'string'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-600 border-t border-gray-500 flex space-x-3">
                    <button className="flex-1 px-3 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-700 transition-colors duration-200">
                      Edit
                    </button>
                    <div className="flex-1 flex space-x-1">
                      {service.status === 'draft' && (
                        <button
                          onClick={() => updateServiceStatus(service.id, 'published')}
                          className="flex-1 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-700 transition-colors duration-200"
                        >
                          Publish
                        </button>
                      )}
                      {service.status === 'published' && (
                        <button
                          onClick={() => updateServiceStatus(service.id, 'draft')}
                          className="flex-1 px-3 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-700 transition-colors duration-200"
                        >
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialIssuanceManager;