import React, { useEffect, useState } from 'react';
import CredentialIssuanceManager from "../components/CredentialIssuanceManager";
import CredentialPerksManager from '../components/CredentialPerksManager';
// Home Component with Developer Section
const HomeComponent = () => {
  const workflowSteps = [
    {
      step: 1,
      title: "Create Credential Item",
      description: "Start by creating either a Credential Issuance or Credential Usage item in our system",
      icon: "📝",
      color: "blue"
    },
    {
      step: 2,
      title: "Submit for Review",
      description: "Your submitted item enters our comprehensive review process",
      icon: "🔍",
      color: "yellow"
    },
    {
      step: 3,
      title: "Manual Verification",
      description: "Our team manually verifies each submission with precision and attention to detail",
      icon: "✅",
      color: "purple"
    },
    {
      step: 4,
      title: "Approval & Integration",
      description: "Once approved, your credentials become available in our ecosystem",
      icon: "🚀",
      color: "green"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Developer Portal</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Welcome to our credential management system. Create, manage, and integrate your digital credentials
          with our comprehensive API platform.
        </p>
      </div>

      {/* Workflow Section */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-gray-400 mb-8">
          Our thorough verification process ensures the highest quality and security standards for all credentials in our ecosystem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <div key={step.step} className="bg-gray-750 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-${step.color}-500 bg-opacity-20 flex items-center justify-center`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{step.step}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24-48h</p>
              <p className="text-gray-400">Average Review Time</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-gray-400">Approval Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-gray-400">Manual Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center hidden">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-6">
          Begin by creating your first credential item or explore our API documentation to integrate with our platform.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Credential Item
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

// Your existing components (updated with process information)
const CredentialIssuance = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-2">Credential Issuance</h2>
      <p className="text-gray-400 mb-4">
        Create issuance credentials that will be manually reviewed by our team. After approval, they will be available in our system.
      </p>
      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-200 text-sm">
          ⏳ <strong>Review Process:</strong> Each submission undergoes manual verification (24-48 hours)
        </p>
      </div>
    </div>
    {/* Your existing credential issuance content */}
  </div>
);

const CredentialUsage = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-2">Credential Usage</h2>
      <p className="text-gray-400 mb-4">
        Create usage credentials for accessing our APIs. All credentials require manual approval before becoming active.
      </p>
      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-200 text-sm">
          ⏳ <strong>Review Process:</strong> Each submission undergoes manual verification (24-48 hours)
        </p>
      </div>
    </div>
    {/* Your existing credential usage content */}
  </div>
);

// Profile Component
const ProfileComponent = () => {
  const [profile, setProfile] = useState({
    name: "",
    organization: "",
    website: "",
    xUsername: "",
    telegramUsername: "",
    discordUsername: "",
    email: ""
  });

  useEffect(() => {
    async function load() {
      const airId = localStorage.getItem('airId');
      const response = await fetch('https://buildlabz.xyz/api/user/' + airId);
      const result = await response.json();

      const profileObj = Object.keys(result).reduce((acc, key) => {
        acc[key] = result[key] ?? '';
        return acc;
      }, {});
      setProfile(profileObj)
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const airId = localStorage.getItem('airId');
    const response = await fetch('https://buildlabz.xyz/api/user/' + airId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    const result = await response.json();
    // Handle profile submission
    console.log("Profile submitted:", profile, result);
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Developer Profile</h2>
        <p className="text-gray-400 mb-6">
          Complete your profile information. Our team will use this information to contact you for verification
          of your provided services and credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Organization
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organization"
                  value={profile.organization}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Your company or organization"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Social Media Handles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Social Media & Contact
            </h3>
            <p className="text-gray-400 text-sm">
              Provide your social media handles for verification and communication purposes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  X (Twitter) Username
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-600 text-gray-300">
                    @
                  </span>
                  <input
                    type="text"
                    name="x_username"
                    value={profile.x_username}
                    onChange={handleChange}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-r-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telegram Username
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-600 text-gray-300">
                    @
                  </span>
                  <input
                    type="text"
                    name="telegram_username"
                    value={profile.telegram_username}
                    onChange={handleChange}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-r-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord Username
                </label>
                <input
                  type="text"
                  name="discord_username"
                  value={profile.discord_username}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="username#1234"
                />
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              🔒 <strong>Verification Process:</strong> Our team will contact you through the provided channels
              to verify your identity and services. This is a mandatory step for credential approval.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Save Profile
            </button>
            <button
              type="button"
              className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// API Component
const APIComponent = () => {
  const [apiKey, setApiKey] = useState("");

  useEffect(function () {
    const airId = localStorage.getItem('airId');
    fetch('https://buildlabz.xyz/api/user_key/' + airId)
      .then(response => response.text())
      .then(data => setApiKey(data));
  }, []);
  const endpoints = {
    issuance: "https://buildlabz.xyz/api/issue",
    usage: "https://api.example.com/api/{air-id}/{usage-key-id}"
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add toast notification here
  };

  return (
    <div className="p-6 space-y-8">
      {/* API Key Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">API Configuration</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your API Key
            </label>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono border border-gray-700">
                {apiKey}
              </code>
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm transition-colors duration-200"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Keep this key secure and do not share it publicly
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">API Endpoints</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm font-medium">Issuance Endpoint</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">POST</span>
            </div>
            <code className="block bg-gray-900 text-blue-400 px-4 py-3 rounded-lg text-sm font-mono border border-gray-700">
              {endpoints.issuance}
            </code>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm font-medium">Usage Endpoint</span>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">GET</span>
            </div>
            <code className="block bg-gray-900 text-blue-400 px-4 py-3 rounded-lg text-sm font-mono border border-gray-700">
              {endpoints.usage}
            </code>
          </div>
        </div>
      </div>

      {/* Credentials Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Issuance Credentials */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Issuance Example</h3>
          </div>
          <div className="">
            <pre className="text-sm text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded">
              <code >
                {`async function issueOnServer(
              airId, 
              airWallet, 
              realWallet, 
              keyId){
  await fetch('https://buildlabz.xyz/api/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        airId, 
        airWallet, 
        realWallet, 
        keyId, 
        key })
  });
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Usage Credentials */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Usage Example</h3>
          </div>
          <div className="">
            <pre className="text-sm text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded">
              <code >
                {`
var response = await fetch(
    'https://buildlabz.xyz/api/verify/' + 
    realWalletAddress + 
    "/resume"
    );
    var dataObj = await response.json();
    if (dataObj.status == "ok") {
        // user is verified
    } else {
      // user is not verified
    }
                `}
              </code>
            </pre>


          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SidebarLayout = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const menuItems = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Profile', label: 'Profile', icon: '👤' },
    { id: 'API', label: 'API', icon: '🔑' },
    { id: 'CredentialIssuance', label: 'Credential Issuance', icon: '📄' },
    { id: 'CredentialUsage', label: 'Credential Usage', icon: '🔍' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeComponent />;
      case 'API':
        return <APIComponent />;
      case 'CredentialIssuance':
        return <CredentialIssuanceManager />;
      case 'CredentialUsage':
        return <CredentialPerksManager />;
      case 'Profile':
        return <ProfileComponent />;
      default:
        return <HomeComponent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Developer Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Credential Management</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;