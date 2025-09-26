import { useState, useEffect } from 'react';
import { IdCard, CheckCircle, Download, View } from 'lucide-react';
import { getLucideIcon } from './icons';

export default function MyCredentials({ updateData }) {
    const [showToast, setShowToast] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [credentials, setCredentials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let wallet = JSON.parse(localStorage.getItem('veriwallet_user')).walletAddress
                const response = await fetch('https://buildlabz.xyz/api/credential/all/' + wallet);
                const data = await response.json();
                setCredentials(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [updateData]);


    const copyToClipboard = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const view = (content) => {

    };

    const download = (content, name) => {
        console.log("here");
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = name + ".signed_credential.txt";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const openDialog = (content, title) => {
        setDialogContent(content);
        setDialogTitle(title);
        setIsDialogOpen(true);
    };

    // تابع برای بستن دیالوگ
    const closeDialog = () => {
        setIsDialogOpen(false);
        setDialogContent('');
        setDialogTitle('');
    };

    return (
        <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
                <IdCard className="w-8 h-8 text-indigo-400" />
                <h2 className="text-3xl font-bold">My Credentials</h2>
            </div>

            <p className="text-slate-400 mb-8 max-w-2xl">
                Manage and share your verified credentials with services and applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((credential) => (
                    <CredentialCard
                        key={credential.id}
                        credential={credential}
                        onShare={copyToClipboard}
                        onDownload={download}
                        onOpenDialog={openDialog}
                    />
                ))}
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-slate-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Link copied to clipboard!</span>
                </div>
            )}
            <Dialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                title={dialogTitle}
                content={dialogContent}
            />
        </section>
    );
}

function CredentialCard({ credential, onShare, onDownload, onOpenDialog }) {


    const Icon = getLucideIcon(credential.icon);

    credential.status = "active";
    credential.color = "from-emerald-500 to-green-500"

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/90 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${credential.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${credential.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                    }`}>
                    {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                </span>
            </div>

            <h3 className="text-xl font-semibold mb-2">{credential.name}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{credential.description}</p>

            <div className="flex justify-between items-center">
                {/* <span className="text-slate-500 text-sm">Expires: {credential.expires}</span> */}
                {/* <button
                    onClick={() => onShare}
                    className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
                >
                    <LinkIcon className="w-4 h-4" />
                    Share Link
                </button> */}
                <button
                    onClick={() => onDownload(credential.signedcred, credential.name)}
                    className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
                <button
                    onClick={() => onOpenDialog(credential.signedcred, credential.name)}
                    className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
                >
                    <View className="w-4 h-4" />
                    View
                </button>

            </div>

        </div>
    );
}

const Dialog = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    // بستن دیالوگ با کلیک خارج از محتوا
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto max-h-96">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
                </div>

                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
