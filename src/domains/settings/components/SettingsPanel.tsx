import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Trash2,
  Eye,
  Type,
  Zap,
  Cloud,
  HelpCircle
} from 'lucide-react';
import { useThemeStore } from '../../ui/store/themeStore';
import { useStorageStore } from '../../storage/store/storageStore';
import { useTutorialStore } from '../../tutorial/store/tutorialStore';

export const SettingsPanel: React.FC = () => {
  const { settings, toggleTheme, setFontSize, setHighContrast, setReduceMotion } = useThemeStore();
  const { exportData, importData, clearAllData, syncToCloud, syncStatus } = useStorageStore();
  const { startTutorial } = useTutorialStore();
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `english-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importData(text);
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format.');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      await clearAllData();
      alert('All data has been cleared.');
    }
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Eye,
      settings: [
        {
          label: 'Theme',
          description: 'Switch between light and dark mode',
          control: (
            <motion.button
              onClick={toggleTheme}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${settings.mode === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-900'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {settings.mode === 'dark' ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light
                </>
              )}
            </motion.button>
          ),
        },
        {
          label: 'Font Size',
          description: 'Adjust text size for better readability',
          control: (
            <select
              value={settings.fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className={`
                px-3 py-2 rounded-lg border
                ${settings.mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          ),
        },
        {
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          control: (
            <motion.button
              onClick={() => setHighContrast(!settings.highContrast)}
              className={`
                w-12 h-6 rounded-full transition-colors relative
                ${settings.highContrast ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                animate={{ x: settings.highContrast ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          ),
        },
        {
          label: 'Reduce Motion',
          description: 'Minimize animations for better performance',
          control: (
            <motion.button
              onClick={() => setReduceMotion(!settings.reduceMotion)}
              className={`
                w-12 h-6 rounded-full transition-colors relative
                ${settings.reduceMotion ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                animate={{ x: settings.reduceMotion ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          ),
        },
      ],
    },
    {
      title: 'Audio',
      icon: Volume2,
      settings: [
        {
          label: 'Sound Effects',
          description: 'Enable sound effects and pronunciation',
          control: (
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${soundEnabled
                  ? 'bg-primary-500 text-white'
                  : settings.mode === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  On
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  Off
                </>
              )}
            </motion.button>
          ),
        },
      ],
    },
    {
      title: 'Data Management',
      icon: Cloud,
      settings: [
        {
          label: 'Export Data',
          description: 'Download your flashcards and progress',
          control: (
            <motion.button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          ),
        },
        {
          label: 'Import Data',
          description: 'Restore from a backup file',
          control: (
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <motion.label
                htmlFor="import-file"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-4 h-4" />
                Import
              </motion.label>
            </div>
          ),
        },
        {
          label: 'Cloud Sync',
          description: 'Sync your data across devices',
          control: (
            <motion.button
              onClick={syncToCloud}
              disabled={syncStatus.syncInProgress}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${syncStatus.syncInProgress
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                }
              `}
              whileHover={{ scale: syncStatus.syncInProgress ? 1 : 1.05 }}
              whileTap={{ scale: syncStatus.syncInProgress ? 1 : 0.95 }}
            >
              <Cloud className={`w-4 h-4 ${syncStatus.syncInProgress ? 'animate-pulse' : ''}`} />
              {syncStatus.syncInProgress ? 'Syncing...' : 'Sync Now'}
            </motion.button>
          ),
        },
        {
          label: 'Clear All Data',
          description: 'Remove all flashcards and progress',
          control: (
            <motion.button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          ),
        },
      ],
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      settings: [
        {
          label: 'Tutorial',
          description: 'Replay the getting started tutorial',
          control: (
            <motion.button
              onClick={() => startTutorial('intro')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-4 h-4" />
              Start Tutorial
            </motion.button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {settingsSections.map((section, sectionIndex) => {
        const IconComponent = section.icon;
        
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className={`
              p-6 rounded-2xl border
              ${settings.mode === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
              }
            `}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
            
            <div className="space-y-4">
              {section.settings.map((setting, settingIndex) => (
                <div
                  key={settingIndex}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{setting.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {setting.control}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Sync Status */}
      {syncStatus.lastSync && (
        <div className={`
          p-4 rounded-lg border
          ${settings.mode === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};