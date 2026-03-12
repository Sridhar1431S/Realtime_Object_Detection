import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Camera, Activity, Settings2 } from "lucide-react";
import { saveDetection } from "@/lib/detectionStore";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ALLOWED_OBJECTS = ["person", "laptop", "cell phone", "chair", "bottle", "keyboard", "mouse", "backpack", "car"];

interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export default function DetectionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(false);
  const [fps, setFps] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [threshold, setThreshold] = useState(0.5);
  const [objectCount, setObjectCount] = useState(0);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastSaveRef = useRef<number>(0);

  // Load model
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await tf.ready();
      const m = await cocoSsd.load({ base: "lite_mobilenet_v2" });
      if (!cancelled) {
        setModel(m);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    setRunning(false);
    cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setDetections([]);
    setFps(0);
  }, []);

  // Detection loop
  useEffect(() => {
    if (!running || !model || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();
    let frameCount = 0;

    const detect = async () => {
      if (!running) return;
      
      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const predictions = await model.detect(video);
        const filtered = predictions.filter(
          (p) => ALLOWED_OBJECTS.includes(p.class) && p.score >= threshold
        ) as Detection[];

        setDetections(filtered);
        setObjectCount(filtered.length);

        // Draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);

        filtered.forEach((d) => {
          const [x, y, w, h] = d.bbox;
          ctx.strokeStyle = "hsl(185, 100%, 50%)";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);

          const label = `${d.class} ${(d.score * 100).toFixed(0)}%`;
          ctx.font = "14px Inter, sans-serif";
          const textW = ctx.measureText(label).width;
          ctx.fillStyle = "hsla(185, 100%, 50%, 0.85)";
          ctx.fillRect(x, y - 22, textW + 12, 22);
          ctx.fillStyle = "hsl(220, 20%, 7%)";
          ctx.fillText(label, x + 6, y - 6);
        });

        // FPS
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = now;
        }

        // Save detections periodically (every 3s max)
        if (filtered.length > 0 && now - lastSaveRef.current > 3000) {
          lastSaveRef.current = now;
          filtered.forEach((d) => {
            saveDetection({
              id: crypto.randomUUID(),
              objectName: d.class,
              confidence: d.score,
              timestamp: Date.now(),
            });
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [running, model, threshold]);

  const captureScreenshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `detection-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Live <span className="text-primary">Detection</span>
          </h1>
          <p className="text-muted-foreground mb-8">Real-time object detection using your webcam.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video feed */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ display: running ? "none" : "none" }} muted playsInline />
                <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-contain ${running ? "" : "hidden"}`} />
                {!running && (
                  <div className="text-center text-muted-foreground">
                    {loading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Loading AI model...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Video className="w-12 h-12 text-primary/50" />
                        <p>Click "Start Detection" to begin</p>
                      </div>
                    )}
                  </div>
                )}

                {/* FPS badge */}
                {running && (
                  <div className="absolute top-3 left-3 glass rounded-md px-3 py-1 text-xs font-mono text-primary">
                    {fps} FPS
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex flex-wrap items-center gap-3 border-t border-border">
                {!running ? (
                  <button
                    onClick={startCamera}
                    disabled={loading || !model}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-cyan text-primary-foreground font-medium disabled:opacity-50 glow-cyan hover:opacity-90 transition"
                  >
                    <Video className="w-4 h-4" />
                    Start Detection
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition"
                  >
                    <VideoOff className="w-4 h-4" />
                    Stop
                  </button>
                )}
                <button
                  onClick={captureScreenshot}
                  disabled={!running}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-foreground font-medium disabled:opacity-40 hover:bg-secondary transition"
                >
                  <Camera className="w-4 h-4" />
                  Screenshot
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Threshold:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-24 accent-primary"
                  />
                  <span className="text-xs font-mono text-primary">{(threshold * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Activity className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold font-mono text-foreground">{fps}</p>
                  <p className="text-xs text-muted-foreground">FPS</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-primary">{objectCount}</p>
                  <p className="text-xs text-muted-foreground">Objects</p>
                </div>
              </div>
            </div>

            {/* Live detections */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Live Detections
              </h3>
              {detections.length === 0 ? (
                <p className="text-sm text-muted-foreground">No objects detected</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {detections.map((d, i) => (
                    <motion.div
                      key={`${d.class}-${i}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                    >
                      <span className="text-sm font-medium text-foreground capitalize">{d.class}</span>
                      <span className="text-xs font-mono text-primary">{(d.score * 100).toFixed(1)}%</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
