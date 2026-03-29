using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;

namespace CitiesSkylines2Mod
{
    public class ModEntry : IMod
    {
        public static readonly string Name = "CitiesSkylines2Mod";
        private static ILog s_log = LogManager.GetLogger(Name);

        public ILog log => s_log;

        public void OnLoad(UpdateSystem updateSystem)
        {
            s_log.InfoFormat(LogChannel.Modding, "Loading {0}", Name);
            updateSystem.UpdateAt<TaxProductionUISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose()
        {
            s_log.InfoFormat(LogChannel.Modding, "Disposing {0}", Name);
        }
    }
}}