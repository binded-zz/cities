using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace CitiesSkylines2Mod
{
    [FileLocation(nameof(CitiesSkylines2Mod))]
    [SettingsUISectionOrder(kSection)]
    [SettingsUIGroupOrder(GroupGeneral)]
    [SettingsUIShowGroupName(GroupGeneral)]
    public class ModSettings : Setting
    {
        public const string kSection = "Main";
        public const string GroupGeneral = "General";

        public ModSettings(IMod mod) : base(mod) { }

        [SettingsUISection(kSection, GroupGeneral)]
        public bool ButtonEnabled { get; set; } = true;

        public override void SetDefaults()
        {
            ButtonEnabled = true;
        }
    }
}