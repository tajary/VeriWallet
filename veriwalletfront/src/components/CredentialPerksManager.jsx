import React, { useState, useEffect } from 'react';

const CredentialPerksManager = () => {
  const [perks, setPerks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'defi',
    url: '',
    status: 'draft',
    credentialRequirements: [
      {
        credentialId: '',
        conditions: [],
        operator: 'AND'
      }
    ],
    globalOperator: 'AND'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // دسته‌بندی‌های perk
  const perkCategories = [
    { value: 'defi', label: 'DeFi', color: 'green', icon: '💰' },
    { value: 'work', label: 'Employment', color: 'blue', icon: '💼' },
    { value: 'education', label: 'Education', color: 'purple', icon: '🎓' },
    { value: 'social', label: 'Social', color: 'pink', icon: '👥' },
    { value: 'finance', label: 'Finance', color: 'emerald', icon: '🏦' },
    { value: 'government', label: 'Government', color: 'gray', icon: '🏛️' },
    { value: 'gaming', label: 'Gaming', color: 'orange', icon: '🎮' },
    { value: 'other', label: 'Other', color: 'indigo', icon: '🔮' }
  ];

  // وضعیت‌ها
  const statusTypes = [
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'archived', label: 'Archived', color: 'gray' }
  ];

  // انواع شرط‌ها
  const conditionTypes = {
    string: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'startsWith', label: 'Starts With' },
      { value: 'endsWith', label: 'Ends With' }
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater Than' },
      { value: 'lessThan', label: 'Less Than' },
      { value: 'between', label: 'Between' }
    ],
    date: [
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' }
    ],
    boolean: [
      { value: 'equals', label: 'Equals' }
    ]
  };

  // بارگذاری داده‌ها
  useEffect(() => {
    // fetchPerks();
    // fetchCredentials();
          Promise.all([
    fetch('/mock-data/credential-perks.json').then(r => r.json()),
    fetch('/mock-data/credential-services.json').then(r => r.json())
  ]).then(([perksData, credentialsData]) => {
    setPerks(perksData.perks);
    setAvailableCredentials(credentialsData.credentialServices);
  });
  }, []);

  const fetchPerks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/perks');
      if (response.ok) {
        const data = await response.json();
        setPerks(data);
      }
    } catch (error) {
      console.error('Error fetching perks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredentials = async () => {
    try {
      const response = await fetch('/api/credential-services');
      if (response.ok) {
        const data = await response.json();
        setAvailableCredentials(data);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const getCredentialProperties = (credentialId) => {
    const credential = availableCredentials.find(c => c.id === credentialId);
    if (!credential) return [];
    
    try {
      const schema = JSON.parse(credential.airkit_schema_json);
      if (schema.properties?.credentialSubject?.properties) {
        return Object.entries(schema.properties.credentialSubject.properties).map(([key, value]) => ({
          key,
          title: value.title || key,
          type: value.type || 'string'
        }));
      }
    } catch (error) {
      console.error('Error parsing credential schema:', error);
    }
    return [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const addCredentialRequirement = () => {
    setFormData({
      ...formData,
      credentialRequirements: [
        ...formData.credentialRequirements,
        {
          credentialId: '',
          conditions: [],
          operator: 'AND'
        }
      ]
    });
  };

  const removeCredentialRequirement = (index) => {
    const newRequirements = formData.credentialRequirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      credentialRequirements: newRequirements
    });
  };

  const handleCredentialChange = (index, credentialId) => {
    const newRequirements = [...formData.credentialRequirements];
    newRequirements[index] = {
      ...newRequirements[index],
      credentialId,
      conditions: []
    };
    setFormData({
      ...formData,
      credentialRequirements: newRequirements
    });
  };

  const addCondition = (credentialIndex) => {
    const newRequirements = [...formData.credentialRequirements];
    const properties = getCredentialProperties(newRequirements[credentialIndex].credentialId);
    
    if (properties.length > 0) {
      newRequirements[credentialIndex].conditions.push({
        property: properties[0].key,
        operator: 'equals',
        value: '',
        value2: ''
      });
      
      setFormData({
        ...formData,
        credentialRequirements: newRequirements
      });
    }
  };

  const removeCondition = (credentialIndex, conditionIndex) => {
    const newRequirements = [...formData.credentialRequirements];
    newRequirements[credentialIndex].conditions = newRequirements[credentialIndex].conditions.filter((_, i) => i !== conditionIndex);
    setFormData({
      ...formData,
      credentialRequirements: newRequirements
    });
  };

  const handleConditionChange = (credentialIndex, conditionIndex, field, value) => {
    const newRequirements = [...formData.credentialRequirements];
    newRequirements[credentialIndex].conditions[conditionIndex][field] = value;
    setFormData({
      ...formData,
      credentialRequirements: newRequirements
    });
  };

  const handleCredentialOperatorChange = (index, operator) => {
    const newRequirements = [...formData.credentialRequirements];
    newRequirements[index].operator = operator;
    setFormData({
      ...formData,
      credentialRequirements: newRequirements
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) newErrors.id = 'Perk ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.url.trim()) newErrors.url = 'URL is required';
    
    formData.credentialRequirements.forEach((req, index) => {
      if (!req.credentialId) {
        newErrors[`credential_${index}`] = 'Credential selection is required';
      }
      if (req.conditions.length === 0) {
        newErrors[`conditions_${index}`] = 'At least one condition is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/perks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({
          id: '',
          title: '',
          category: 'defi',
          url: '',
          status: 'draft',
          credentialRequirements: [
            {
              credentialId: '',
              conditions: [],
              operator: 'AND'
            }
          ],
          globalOperator: 'AND'
        });
        setShowForm(false);
        setErrors({});
        fetchPerks();
      } else {
        console.error('Failed to save perk');
      }
    } catch (error) {
      console.error('Error saving perk:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePerkStatus = async (perkId, newStatus) => {
    try {
      const response = await fetch(`/api/perks/${perkId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchPerks();
      } else {
        console.error('Failed to update perk status');
      }
    } catch (error) {
      console.error('Error updating perk status:', error);
    }
  };

  const getCategoryColor = (category) => {
    const cat = perkCategories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const getStatusColor = (status) => {
    const statusObj = statusTypes.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const getStatusStats = () => {
    const stats = {};
    statusTypes.forEach(status => {
      stats[status.value] = perks.filter(p => p.status === status.value).length;
    });
    return stats;
  };

  const filteredPerks = perks.filter(perk => {
    const categoryMatch = filterCategory === 'all' || perk.category === filterCategory;
    const statusMatch = filterStatus === 'all' || perk.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const categoryStats = perkCategories.map(cat => ({
    ...cat,
    count: perks.filter(p => p.category === cat.value).length
  }));

  const statusStats = getStatusStats();

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Credential Perks Manager</h1>
          <p className="mt-2 text-lg text-gray-400">
            Define perks and their credential requirements with visual conditions
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Perk
              </button>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">Category:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-48 pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all" className="bg-gray-700">All Categories</option>
                    {perkCategories.map(category => (
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
                <div className="text-2xl font-bold text-white">{perks.length}</div>
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
                <h4 className="text-sm font-medium text-gray-300 mb-3">Perks by Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryStats.map(category => (
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
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Perks by Status</h4>
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

        {/* Add Perk Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Create New Perk</h2>
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
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">
                      Perk ID *
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
                      placeholder="unique-perk-id"
                    />
                    {errors.id && <p className="mt-1 text-sm text-red-400">{errors.id}</p>}
                  </div>

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
                      placeholder="e.g., Senior Solidity Developer Position"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                  </div>

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
                      {perkCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  <div className="md:col-span-2">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                      Perk URL *
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.url ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="https://example.com/perk"
                    />
                    {errors.url && <p className="mt-1 text-sm text-red-400">{errors.url}</p>}
                  </div>
                </div>

                {/* Credential Requirements */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Credential Requirements</h3>
                    <button
                      type="button"
                      onClick={addCredentialRequirement}
                      className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Credential
                    </button>
                  </div>

                  {formData.credentialRequirements.map((requirement, credIndex) => (
                    <div key={credIndex} className="bg-gray-700 rounded-lg p-6 mb-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-white">
                          Credential Requirement #{credIndex + 1}
                        </h4>
                        {formData.credentialRequirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCredentialRequirement(credIndex)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Credential Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select Credential *
                        </label>
                        <select
                          value={requirement.credentialId}
                          onChange={(e) => handleCredentialChange(credIndex, e.target.value)}
                          className={`w-full px-3 py-2 bg-gray-600 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`credential_${credIndex}`] ? 'border-red-500' : 'border-gray-500'
                          }`}
                        >
                          <option value="" className="bg-gray-700">Choose a credential...</option>
                          {availableCredentials.map(cred => (
                            <option key={cred.id} value={cred.id} className="bg-gray-700">
                              {cred.title} ({cred.category})
                            </option>
                          ))}
                        </select>
                        {errors[`credential_${credIndex}`] && (
                          <p className="mt-1 text-sm text-red-400">{errors[`credential_${credIndex}`]}</p>
                        )}
                      </div>

                      {/* Conditions */}
                      {requirement.credentialId && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-300">Conditions</h5>
                            <button
                              type="button"
                              onClick={() => addCondition(credIndex)}
                              className="inline-flex items-center px-2 py-1 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                            >
                              Add Condition
                            </button>
                          </div>

                          {requirement.conditions.map((condition, condIndex) => {
                            const properties = getCredentialProperties(requirement.credentialId);
                            const currentProperty = properties.find(p => p.key === condition.property);
                            const availableOperators = conditionTypes[currentProperty?.type || 'string'] || conditionTypes.string;

                            return (
                              <div key={condIndex} className="bg-gray-600 rounded-lg p-4 border border-gray-500">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  {/* Property Selection */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Property</label>
                                    <select
                                      value={condition.property}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'property', e.target.value)}
                                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                    >
                                      {properties.map(prop => (
                                        <option key={prop.key} value={prop.key}>
                                          {prop.title}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Operator */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Condition</label>
                                    <select
                                      value={condition.operator}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'operator', e.target.value)}
                                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                    >
                                      {availableOperators.map(op => (
                                        <option key={op.value} value={op.value}>
                                          {op.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Value */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Value</label>
                                    <input
                                      type={currentProperty?.type === 'number' ? 'number' : 'text'}
                                      value={condition.value}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'value', e.target.value)}
                                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                      placeholder="Enter value"
                                    />
                                  </div>

                                  {/* Second Value for Between */}
                                  {(condition.operator === 'between') && (
                                    <div>
                                      <label className="block text-xs font-medium text-gray-400 mb-1">And</label>
                                      <input
                                        type={currentProperty?.type === 'number' ? 'number' : 'text'}
                                        value={condition.value2}
                                        onChange={(e) => handleConditionChange(credIndex, condIndex, 'value2', e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                        placeholder="Second value"
                                      />
                                    </div>
                                  )}

                                  {/* Remove Condition Button */}
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => removeCondition(credIndex, condIndex)}
                                      className="text-red-400 hover:text-red-300 text-xs transition-colors duration-200"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {errors[`conditions_${credIndex}`] && (
                            <p className="text-sm text-red-400">{errors[`conditions_${credIndex}`]}</p>
                          )}

                          {/* Credential-level Operator */}
                          {requirement.conditions.length > 1 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400">Combine conditions with:</span>
                              <select
                                value={requirement.operator}
                                onChange={(e) => handleCredentialOperatorChange(credIndex, e.target.value)}
                                className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Global Operator */}
                  {formData.credentialRequirements.length > 1 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-400">Combine credentials with:</span>
                      <select
                        value={formData.globalOperator}
                        onChange={(e) => setFormData({...formData, globalOperator: e.target.value})}
                        className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                      >
                        <option value="AND">AND (All credentials required)</option>
                        <option value="OR">OR (Any credential sufficient)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
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
                        Creating...
                      </>
                    ) : (
                      'Create Perk'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Perks List */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          {loading && perks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-400">Loading perks...</p>
            </div>
          ) : filteredPerks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-600">🎁</div>
              <h3 className="text-lg font-medium text-white mb-2">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'No perks found' 
                  : 'No perks found with selected filters'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'Get started by creating your first perk with credential requirements.' 
                  : 'Try changing your filters or create a new perk.'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Create First Perk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredPerks.map((perk) => (
                <div
                  key={perk.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:border-gray-500"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{perk.title}</h3>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(perk.category)}-900 bg-opacity-50 text-${getCategoryColor(perk.category)}-300`}
                        >
                          {perkCategories.find(c => c.value === perk.category)?.icon} {perkCategories.find(c => c.value === perk.category)?.label}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(perk.status)}-900 bg-opacity-50 text-${getStatusColor(perk.status)}-300`}
                        >
                          {statusTypes.find(s => s.value === perk.status)?.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 font-mono">ID: {perk.id}</p>
                    <a
                      href={perk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block transition-colors duration-200"
                    >
                      {perk.url}
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-white mb-3">Credential Requirements</h4>
                    <div className="space-y-3">
                      {perk.credentialRequirements?.map((req, index) => {
                        const credential = availableCredentials.find(c => c.id === req.credentialId);
                        return (
                          <div key={index} className="bg-gray-600 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                {credential?.title || 'Unknown Credential'}
                              </span>
                              {req.conditions.length > 1 && (
                                <span className="text-xs text-gray-400">({req.operator})</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              {req.conditions?.map((condition, condIndex) => (
                                <div key={condIndex} className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                                  {condition.property} {condition.operator} "{condition.value}"
                                  {condition.value2 && ` and "${condition.value2}"`}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {perk.credentialRequirements?.length > 1 && (
                      <div className="mt-3 text-center">
                        <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                          Global: {perk.globalOperator}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-600 border-t border-gray-500 flex space-x-3">
                    <button className="flex-1 px-3 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                      Edit
                    </button>
                    <div className="flex-1 flex space-x-1">
                      {perk.status === 'draft' && (
                        <button
                          onClick={() => updatePerkStatus(perk.id, 'published')}
                          className="flex-1 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                        >
                          Publish
                        </button>
                      )}
                      {perk.status === 'published' && (
                        <button
                          onClick={() => updatePerkStatus(perk.id, 'draft')}
                          className="flex-1 px-3 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
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

export default CredentialPerksManager;