import { useState } from 'react';
import { Wallet, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";



export default function Login() {
    const [isConnecting, setIsConnecting] = useState(false);
    const { login } = useAuth();

    const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15LWtleS0xIn0.eyJwYXJ0bmVySWQiOiIyYjViNGIyNC0wZjJmLTRkMWItYTdiMi0zOWRiMjUwNDU4OWYiLCJzY29wZSI6Imlzc3VlIHZlcmlmeSIsImV4cCI6MTc2MTgzMjcyMSwiaWF0IjoxNzU4ODMyNzIxfQ.E8OCoVLxbsFlLULxjK8Lj9sCftbrJFlGNHjwdojXqMTMzI3CyJlTcKQ9EnsW6tw6ud50esXj1cfQBSS4rBHxdsjJtM0Bptg9WDLYY2-Txnu96v_EoOpNvCL2q9gNGy5XDmjPmnA5EZH0PR1QZQkrADPq91X61Wql3tJAL_pV4K0IdHcrWOiCOY-BcVo8gIyGk8PMsR9RYJdNWfrQSX94fSOSXDHFwST0uJv1F0_kxOtPE7iwGjg_6mTSfygfZwtutL362eLbDVDHlG8VHpCzN0e4K7vfyZqQxUHKZGpRl7EP1twZx08mpF1FQibZn-lKlZeciNuhmcHTVm44UEcb1Q";
    //window.service = null;
    let userId = ""

    const handleLogin = async (e) => {
        e.preventDefault();

        setIsConnecting(true);


        window.service = new AirService({
            partnerId: "2b5b4b24-0f2f-4d1b-a7b2-39db2504589f",
        });

        // Trigger the login flow
        await window.service.init({
            buildEnv: BUILD_ENV.SANDBOX,
            enableLogging: true,
            skipRehydration: true
        });

        const loggedInResult = await window.service.login();

        console.log(loggedInResult)

        if (loggedInResult.isLoggedIn) {
            login(loggedInResult.abstractAccountAddress);
            localStorage.setItem("airId",loggedInResult.id);
        }
        setIsConnecting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        VeriWallet
                    </h1>
                    <p className="text-slate-400">Your decentralized identity manager</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-400">Login to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <button
                            type="submit"
                            
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isConnecting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>


                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            By connecting, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}