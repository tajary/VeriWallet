import React, { useState, useEffect } from 'react';

const CredentialPerksManager2 = () => {
  const [perks, setPerks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'defi',
    url: '',
    status: 'draft', // وضعیت جدید
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
    //fetchPerks();
    //fetchCredentials();

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
      conditions: [] // Reset conditions when credential changes
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
        value2: '' // For between conditions
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
    
    // Validate credential requirements
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

  // تابع برای تغییر وضعیت perk
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
        fetchPerks(); // Refresh the list
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Credential Perks Manager</h1>
          <p className="mt-2 text-lg text-gray-600">
            Define perks and their credential requirements with visual conditions
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Categories</option>
                    {perkCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Status</option>
                    {statusTypes.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{perks.length}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statusStats.published || 0}</div>
                <div className="text-gray-500">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{statusStats.draft || 0}</div>
                <div className="text-gray-500">Draft</div>
              </div>
            </div>
          </div>

          {/* Category & Status Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Perks by Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryStats.map(category => (
                    <div
                      key={category.value}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-${category.color}-50 border border-${category.color}-200 cursor-pointer ${
                        filterCategory === category.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setFilterCategory(category.value)}
                    >
                      <span className="text-sm">{category.icon}</span>
                      <span className={`text-sm font-medium text-${category.color}-800`}>
                        {category.label}
                      </span>
                      <span className={`text-xs text-${category.color}-600 bg-${category.color}-100 px-2 py-1 rounded-full`}>
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Perks by Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusTypes.map(status => (
                    <div
                      key={status.value}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-${status.color}-50 border border-${status.color}-200 cursor-pointer ${
                        filterStatus === status.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setFilterStatus(status.value)}
                    >
                      <span className={`text-sm font-medium text-${status.color}-800`}>
                        {status.label}
                      </span>
                      <span className={`text-xs text-${status.color}-600 bg-${status.color}-100 px-2 py-1 rounded-full`}>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create New Perk</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                      Perk ID *
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="unique-perk-id"
                    />
                    {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Solidity Developer Position"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {perkCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusTypes.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                      Perk URL *
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.url ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/perk"
                    />
                    {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                  </div>
                </div>

                {/* Credential Requirements Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Credential Requirements</h3>
                    <button
                      type="button"
                      onClick={addCredentialRequirement}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Credential
                    </button>
                  </div>

                  {/* Credential Requirements List */}
                  {formData.credentialRequirements.map((requirement, credIndex) => (
                    <div key={credIndex} className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">
                          Credential Requirement #{credIndex + 1}
                        </h4>
                        {formData.credentialRequirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCredentialRequirement(credIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Credential Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Credential *
                        </label>
                        <select
                          value={requirement.credentialId}
                          onChange={(e) => handleCredentialChange(credIndex, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`credential_${credIndex}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Choose a credential...</option>
                          {availableCredentials.map(cred => (
                            <option key={cred.id} value={cred.id}>
                              {cred.title} ({cred.category})
                            </option>
                          ))}
                        </select>
                        {errors[`credential_${credIndex}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`credential_${credIndex}`]}</p>
                        )}
                      </div>

                      {/* Conditions */}
                      {requirement.credentialId && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-700">Conditions</h5>
                            <button
                              type="button"
                              onClick={() => addCondition(credIndex)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Add Condition
                            </button>
                          </div>

                          {requirement.conditions.map((condition, condIndex) => {
                            const properties = getCredentialProperties(requirement.credentialId);
                            const currentProperty = properties.find(p => p.key === condition.property);
                            const availableOperators = conditionTypes[currentProperty?.type || 'string'] || conditionTypes.string;

                            return (
                              <div key={condIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  {/* Property Selection */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Property</label>
                                    <select
                                      value={condition.property}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'property', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                                    <select
                                      value={condition.operator}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'operator', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                                    <input
                                      type={currentProperty?.type === 'number' ? 'number' : 'text'}
                                      value={condition.value}
                                      onChange={(e) => handleConditionChange(credIndex, condIndex, 'value', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="Enter value"
                                    />
                                  </div>

                                  {/* Second Value for Between */}
                                  {(condition.operator === 'between') && (
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">And</label>
                                      <input
                                        type={currentProperty?.type === 'number' ? 'number' : 'text'}
                                        value={condition.value2}
                                        onChange={(e) => handleConditionChange(credIndex, condIndex, 'value2', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        placeholder="Second value"
                                      />
                                    </div>
                                  )}

                                  {/* Remove Condition Button */}
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => removeCondition(credIndex, condIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {errors[`conditions_${credIndex}`] && (
                            <p className="text-sm text-red-600">{errors[`conditions_${credIndex}`]}</p>
                          )}

                          {/* Credential-level Operator */}
                          {requirement.conditions.length > 1 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Combine conditions with:</span>
                              <select
                                value={requirement.operator}
                                onChange={(e) => handleCredentialOperatorChange(credIndex, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
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
                      <span className="text-sm text-gray-600">Combine credentials with:</span>
                      <select
                        value={formData.globalOperator}
                        onChange={(e) => setFormData({...formData, globalOperator: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="AND">AND (All credentials required)</option>
                        <option value="OR">OR (Any credential sufficient)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Perk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Perks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading && perks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading perks...</p>
            </div>
          ) : filteredPerks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'No perks found' 
                  : `No perks found with selected filters`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterCategory === 'all' && filterStatus === 'all' 
                  ? 'Get started by creating your first perk with credential requirements.' 
                  : 'Try changing your filters or create a new perk.'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create First Perk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredPerks.map((perk) => (
                <div
                  key={perk.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{perk.title}</h3>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(perk.category)}-100 text-${getCategoryColor(perk.category)}-800`}
                        >
                          {perkCategories.find(c => c.value === perk.category)?.icon} {perkCategories.find(c => c.value === perk.category)?.label}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(perk.status)}-100 text-${getStatusColor(perk.status)}-800`}
                        >
                          {statusTypes.find(s => s.value === perk.status)?.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-mono">ID: {perk.id}</p>
                    <a
                      href={perk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 text-sm mt-1 inline-block"
                    >
                      {perk.url}
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Credential Requirements</h4>
                    <div className="space-y-3">
                      {perk.credentialRequirements?.map((req, index) => {
                        const credential = availableCredentials.find(c => c.id === req.credentialId);
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {credential?.title || 'Unknown Credential'}
                              </span>
                              {req.conditions.length > 1 && (
                                <span className="text-xs text-gray-500">({req.operator})</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              {req.conditions?.map((condition, condIndex) => (
                                <div key={condIndex} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
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
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Global: {perk.globalOperator}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Edit
                    </button>
                    <div className="flex-1 flex space-x-1">
                      {perk.status === 'draft' && (
                        <button
                          onClick={() => updatePerkStatus(perk.id, 'published')}
                          className="flex-1 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Publish
                        </button>
                      )}
                      {perk.status === 'published' && (
                        <button
                          onClick={() => updatePerkStatus(perk.id, 'draft')}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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