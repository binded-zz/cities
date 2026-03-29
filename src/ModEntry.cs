using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;

namespace CitiesSkylines2Mod
{
    public class ModEntry : IMod
    {
        public static readonly string Name = "CitiesSkylines2Mod";
        public static ILog log = LogManager.GetLogger($"{nameof(CitiesSkylines2Mod)}.{nameof(ModEntry)}").SetShowsErrorsInUI(false);
        public static ModSettings Settings { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info($"Loading {Name}");

            Settings = new ModSettings(this);
            Settings.RegisterInOptionsUI();
            AssetDatabase.global.LoadSettings(nameof(CitiesSkylines2Mod), Settings, new ModSettings(this));

            updateSystem.UpdateAt<TaxProductionUISystem>(SystemUpdatePhase.UIUpdate);
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
    }
}