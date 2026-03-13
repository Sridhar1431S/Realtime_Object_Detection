import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scan, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { playClickSound } from "@/lib/settingsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!email) { toast.error("Enter your email"); return; }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { toast.error(error); } else { setSent(true); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-cyan flex items-center justify-center mb-4">
              <Scan className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground">Check your email for a password reset link.</p>
              <Link to="/login" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-cyan text-primary-foreground font-medium">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Link to="/login" className="text-primary text-sm hover:underline flex items-center gap-1 justify-center">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
