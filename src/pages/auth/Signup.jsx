import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        if (!isSupabaseConfigured) {
            setError("❌ Supabase connection missing! Please check .env file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Register user with Supabase
            // The handle_new_user trigger in Postgres will automatically create the profile row
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    },
                },
            });

            if (authError) throw authError;

            // If email confirmation is enabled, user might not be logged in yet
            if (authData.session) {
                navigate('/');
            } else {
                // If session is null, it means email verification is required or auto-login is off
                alert('Account created! Please check your email/login.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        if (!isSupabaseConfigured) {
            setError("❌ Supabase connection missing! Please check .env file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin,
                }
            });

            if (authError) throw authError;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-sm p-8 bg-white border shadow-sm rounded-3xl border-slate-100">
                <div className="mb-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-600 shadow-lg rounded-xl shadow-blue-200">
                        <span className="text-xl font-bold text-white">T</span>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-sm text-slate-500">Start your style journey today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 border border-red-100 bg-red-50 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-slate-900">FULL NAME</label>
                        <input
                            {...register('fullName', { required: 'Name is required' })}
                            type="text"
                            className="w-full h-12 px-4 font-medium transition-all border bg-slate-50 rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="ml-1 text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-slate-900">EMAIL</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="w-full h-12 px-4 font-medium transition-all border bg-slate-50 rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                            placeholder="hello@example.com"
                        />
                        {errors.email && <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-slate-900">PASSWORD</label>
                        <input
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            className="w-full h-12 px-4 font-medium transition-all border bg-slate-50 rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="ml-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 p-3 my-2 bg-slate-50 rounded-xl">
                        <input type="checkbox" required className="w-5 h-5 rounded cursor-pointer accent-blue-600" />
                        <span className="text-xs font-medium leading-tight text-slate-500">
                            I agree to the <a href="#" className="underline text-slate-900">Terms</a> and <a href="#" className="underline text-slate-900">Privacy Policy</a>
                        </span>
                    </div>

                    <Button disabled={loading} className="w-full mt-2 text-lg font-bold bg-blue-600 shadow-xl h-14 shadow-blue-200 hover:bg-blue-700 rounded-xl">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs font-bold tracking-wider uppercase">
                            <span className="px-2 bg-white text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            disabled={loading}
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-3 w-full h-14 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-base shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 rounded-full border-slate-300 border-t-slate-600 animate-spin"></div>
                                    Redirecting...
                                </span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-sm font-medium text-center text-slate-500">
                    Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Log in</Link>
                </p>
            </div>
        </div>
    );
};
