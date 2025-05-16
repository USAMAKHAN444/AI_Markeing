
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      // We still show success for security reasons
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="w-full max-w-md p-4">
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Check your email</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <Button asChild variant="outline" className="mt-2">
                    <Link to="/login">Back to login</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-marketing-600 hover:text-marketing-800 font-medium">
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
