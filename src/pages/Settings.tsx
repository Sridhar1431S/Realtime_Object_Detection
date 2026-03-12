import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Eye, Palette, Gauge } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { getSettings, saveSettings, playClickSound, AppSettings } from "@/lib/settingsStore";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  const update = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveSettings(next);
    window.dispatchEvent(new Event('settings-changed'));
    playClickSound();
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-primary">Settings</span>
          </h1>
          <p className="text-muted-foreground mb-10">Configure detection, UI, and performance options.</p>
        </motion.div>

        <div className="space-y-8">
          {/* Detection Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-cyan flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Detection Settings</h2>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Confidence Threshold</span>
                  <span className="text-sm font-mono text-primary">{(settings.confidenceThreshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range" min="0.1" max="0.95" step="0.05"
                  value={settings.confidenceThreshold}
                  onChange={(e) => update({ confidenceThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Object Tracking</p>
                  <p className="text-xs text-muted-foreground">Maintain consistent IDs across frames</p>
                </div>
                <Switch checked={settings.trackingEnabled} onCheckedChange={(v) => update({ trackingEnabled: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Object Counting</p>
                  <p className="text-xs text-muted-foreground">Count detected objects in real-time</p>
                </div>
                <Switch checked={settings.countingEnabled} onCheckedChange={(v) => update({ countingEnabled: v })} />
              </div>
            </div>
          </motion.div>

          {/* UI Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-cyan flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">UI Settings</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                </div>
                <Switch checked={settings.darkMode} onCheckedChange={(v) => update({ darkMode: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Sound Effects</p>
                  <p className="text-xs text-muted-foreground">Play click sounds on interactions</p>
                </div>
                <Switch checked={settings.soundEnabled} onCheckedChange={(v) => update({ soundEnabled: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Animations</p>
                  <p className="text-xs text-muted-foreground">Enable UI animations and transitions</p>
                </div>
                <Switch checked={settings.animationsEnabled} onCheckedChange={(v) => update({ animationsEnabled: v })} />
              </div>
            </div>
          </motion.div>

          {/* Performance Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-cyan flex items-center justify-center">
                <Gauge className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Performance Settings</h2>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Frame Rate</span>
                  <span className="text-sm font-mono text-primary">{settings.frameRate} FPS</span>
                </div>
                <input
                  type="range" min="5" max="60" step="5"
                  value={settings.frameRate}
                  onChange={(e) => update({ frameRate: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Performance Mode</p>
                  <p className="text-xs text-muted-foreground">Reduce visual quality for faster processing</p>
                </div>
                <Switch checked={settings.performanceMode} onCheckedChange={(v) => update({ performanceMode: v })} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
