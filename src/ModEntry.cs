using Colossal.Logging;
using Colossal.IO.AssetDatabase;
using Game;
using Game.Modding;
using Game.SceneFlow;
using Game.Settings;

namespace CitiesSkylines2Mod
{
    public class Mod : IMod
    {
        public static readonly string Name = "AdvancedTPM";
        public static readonly string Version = "1.0.0";
        public static ILog log = LogManager.GetLogger($"{nameof(CitiesSkylines2Mod)}.{nameof(Mod)}").SetShowsErrorsInUI(false);
        public static TPMModSettings Settings { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info($"Loading {Name} v{Version}");

            Settings = new TPMModSettings(this);
            Settings.RegisterInOptionsUI();
            AssetDatabase.global.LoadSettings(nameof(CitiesSkylines2Mod), Settings, new TPMModSettings(this));

            updateSystem.UpdateAt<TaxingProductionUISystem>(SystemUpdatePhase.UIUpdate);

            log.Info($"{Name} loaded successfully");
        }

        public void OnDispose()
        {
            Settings?.UnregisterInOptionsUI();
            Settings = null;
            log.Info($"Disposing {Name}");
        }

    }
}