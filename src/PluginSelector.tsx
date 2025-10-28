import { useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
import { toast } from "sonner";
import { Button } from "./components/ui/button";
import allPluginConfigs from "./assets/plugins/allPluginConfigs.json";
import { ChevronRight, Copy } from "lucide-react";
import { Textarea } from "./components/ui/textarea";

interface PluginConfig {
  name: string;
  package_name: string;
  version: string;
  configs: object;
}

export default function PluginSelector() {
  const initialPlugins: PluginConfig[] = allPluginConfigs.map((config) => ({
    name: config.name,
    package_name: config.package_name,
    version: config.version,
    configs: config.configs,
  }));

  const [selectedPlugins, setSelectedPlugins] = useState<PluginConfig[]>([]);
  const [textareaValue, setTextareaValue] = useState<string>("[]");

  const copyToClipboard = async (config: string) => {
    if (config.trim() === "[]") return;
    await navigator.clipboard.writeText(config);
    toast("Config copied to clipboard");
  };

  const handlePluginToggle = (plugin: PluginConfig) => {
    let currentPlugins: PluginConfig[] = [];

    try {
      const parsed = JSON.parse(textareaValue);
      if (Array.isArray(parsed)) currentPlugins = parsed;
    } catch {
      toast("Invalid JSON, fix JSON before selecting new plugin");
      return;
    }

    const isSelected = currentPlugins.some((p) => p.name === plugin.name);
    let updatedPlugins: PluginConfig[];

    if (isSelected) {
      updatedPlugins = currentPlugins.filter((p) => p.name !== plugin.name);
    } else {
      const existing = currentPlugins.find((p) => p.name === plugin.name);
      updatedPlugins = [...currentPlugins, existing ? existing : plugin];
    }

    setSelectedPlugins(updatedPlugins);
    setTextareaValue(JSON.stringify(updatedPlugins, null, 2));
  };

  const handleTextareaChange = (text: string) => {
    setTextareaValue(text);

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setSelectedPlugins(parsed);
      }
    } catch {
      // Invalid JSON - user is still typing, so ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plugin Selector
          </h1>
          <p className="text-gray-600">
            Select a plugin to view, edit, and copy its JSON configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-mi">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Available Plugins</h2>
            <div className="space-y-3 overflow-y-auto max-h-[500px]">
              {initialPlugins.map((plugin: PluginConfig) => {
                const isSelected = selectedPlugins.some(
                  (p) => p.name === plugin.name
                );
                return (
                  <div
                    key={plugin.name}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                    onClick={() => handlePluginToggle(plugin)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handlePluginToggle(plugin)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {plugin.name}
                        </h3>
                      </div>
                      {isSelected && (
                        <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Configuration</h2>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Select plugins or paste/edit plugin JSON here"
                value={textareaValue}
                onChange={(e) => handleTextareaChange(e.target.value)}
                className="min-h-[500px] font-mono"
              />

              <Button
                onClick={() => copyToClipboard(textareaValue)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
              >
                <Copy className="size-4 mr-2" />
                Copy Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
