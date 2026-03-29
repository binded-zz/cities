using Colossal.Logging;
using Game.Modding;

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
        }

        public void OnDispose()
        {
            s_log.InfoFormat(LogChannel.Modding, "Disposing {0}", Name);
        }

        public void OnUpdate()
        {
        }
    }
}