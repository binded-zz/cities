using Colossal.IO.AssetDatabase;
using Colossal.Localization;
using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.Json;

namespace CitiesSkylines2Mod
{
    public class ModEntry : IMod
    {
        public static readonly string Name = "CitiesSkylines2Mod";
        public static readonly string Version = "1.0.0";
        public static ILog log = LogManager.GetLogger($"{nameof(CitiesSkylines2Mod)}.{nameof(ModEntry)}").SetShowsErrorsInUI(false);
        public static ModSettings Settings { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info($"Loading {Name} v{Version}");

            Settings = new ModSettings(this);
            Settings.RegisterInOptionsUI();
            AssetDatabase.global.LoadSettings(nameof(CitiesSkylines2Mod), Settings, new ModSettings(this));

            LoadLocale();

            updateSystem.UpdateAt<TaxProductionUISystem>(SystemUpdatePhase.UIUpdate);

            log.Info($"{Name} loaded successfully");
        }

        public void OnDispose()
        {
            log.Info($"Disposing {Name}");
            if (Settings != null)
            {
                Settings.UnregisterInOptionsUI();
                Settings = null;
            }
        }

        private static void LoadLocale()
        {
            try
            {
                var modDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                var localePath = Path.Combine(modDir, "locale", "en-US.json");

                if (!File.Exists(localePath))
                {
                    log.Warn($"Locale file not found: {localePath}");
                    return;
                }

                var json = File.ReadAllText(localePath);
                var entries = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
                GameManager.instance.localizationManager.AddSource("en-US", new MemorySource(entries));
                log.Info($"Locale loaded ({entries.Count} entries)");
            }
            catch (System.Exception ex)
            {
                log.Error($"Failed to load locale: {ex.Message}");
            }
        }
    }
}