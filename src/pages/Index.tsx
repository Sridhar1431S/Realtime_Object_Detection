import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Video, Zap, Shield, BarChart3, Clock } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Powered by YOLO AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Real-time Object
            <br />
            <span className="text-primary glow-text">Detection System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Experience cutting-edge AI technology that identifies and tracks objects in images and video streams with exceptional accuracy and speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/detection"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg gradient-cyan text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-cyan"
            >
              <Upload className="w-5 h-5" />
              Upload Image
              <span className="ml-1">→</span>
            </Link>
            <Link
              to="/detection"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg glass text-foreground font-semibold hover:bg-secondary transition-colors"
            >
              <Video className="w-5 h-5" />
              Start Webcam Detection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built for speed and accuracy with state-of-the-art deep learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Real-time Processing", desc: "Detect objects in live video with minimal latency." },
              { icon: Shield, title: "High Accuracy", desc: "YOLO-powered detection with confidence scoring." },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Track detection history and view statistics." },
              { icon: Video, title: "Webcam Support", desc: "Use your device camera for live detection." },
              { icon: Clock, title: "Detection History", desc: "Review past detections with timestamps." },
              { icon: Upload, title: "Image Upload", desc: "Upload images for instant object detection." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg gradient-cyan flex items-center justify-center mb-4 group-hover:glow-cyan transition-shadow">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
