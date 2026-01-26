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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 shadow-lg shadow-blue-200 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 text-sm">Start your style journey today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-900 ml-1">FULL NAME</label>
                        <input
                            {...register('fullName', { required: 'Name is required' })}
                            type="text"
                            className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs ml-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-900 ml-1">EMAIL</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                            placeholder="hello@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-900 ml-1">PASSWORD</label>
                        <input
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 my-2 bg-slate-50 p-3 rounded-xl">
                        <input type="checkbox" required className="accent-blue-600 w-5 h-5 rounded cursor-pointer" />
                        <span className="text-xs text-slate-500 font-medium leading-tight">
                            I agree to the <a href="#" className="underline text-slate-900">Terms</a> and <a href="#" className="underline text-slate-900">Privacy Policy</a>
                        </span>
                    </div>

                    <Button disabled={loading} className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 rounded-xl mt-2">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Log in</Link>
                </p>
            </div>
        </div>
    );
};
