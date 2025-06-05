import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader'; 

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <LoginHeader /> 
      <LoginForm />
    </div>
  );
}