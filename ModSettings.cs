using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace CitiesSkylines2Mod
{
    [FileLocation(nameof(CitiesSkylines2Mod))]
    [SettingsUIGroupOrder(GroupGeneral)]
    [SettingsUIShowGroupName(GroupGeneral)]
    public class ModSettings : Setting
    {
        public const string GroupGeneral = "General";

        public ModSettings(IMod mod) : base(mod) { }

        [SettingsUISection(GroupGeneral)]
        public bool ButtonEnabled { get; set; } = true;

        public override void SetDefaults()
        {
            ButtonEnabled = true;
        }
    }
}