import { motion } from "framer-motion";
import { Brain, Cpu, Zap, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="text-primary">AI Detect</span>
          </h1>
          <p className="text-muted-foreground mb-10">
            A real-time object detection system powered by deep learning.
          </p>
        </motion.div>

        <div className="space-y-6">
          {[
            { icon: Brain, title: "Deep Learning Powered", desc: "Uses COCO-SSD (MobileNet v2) running entirely in your browser via TensorFlow.js. No server required for inference." },
            { icon: Zap, title: "Real-time Processing", desc: "Processes live webcam frames continuously with bounding box overlays, confidence scores, and FPS monitoring." },
            { icon: Cpu, title: "Client-side AI", desc: "All detection happens locally on your device. Your video never leaves your browser, ensuring complete privacy." },
            { icon: Shield, title: "Privacy First", desc: "No data is sent to external servers. Detection history is stored locally in your browser's storage." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 flex gap-5"
            >
              <div className="w-12 h-12 rounded-lg gradient-cyan flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
