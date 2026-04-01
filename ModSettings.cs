using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace CitiesSkylines2Mod
{
    [FileLocation(nameof(CitiesSkylines2Mod))]
    [SettingsUIGroupOrder(GroupGeneral, GroupDebug, GroupAbout)]
    [SettingsUIShowGroupName(GroupGeneral, GroupDebug, GroupAbout)]
    public class ModSettings : Setting
    {
        public const string kSection = "Main";
        public const string GroupGeneral = "General";
        public const string GroupDebug = "Debug";
        public const string GroupAbout = "About";

        public ModSettings(IMod mod) : base(mod) { }

        // ── General ──────────────────────────────────────────────────────────

        [SettingsUISection(kSection, GroupGeneral)]
        public bool ButtonEnabled { get; set; } = true;

        [SettingsUISection(kSection, GroupGeneral)]
        [SettingsUISlider(min = 0, max = 100, step = 1)]
        public int DefaultTaxRate { get; set; } = 15;

        // ── Debug ─────────────────────────────────────────────────────────────

        [SettingsUISection(kSection, GroupDebug)]
        public bool DebugMode { get; set; } = false;

        [SettingsUISection(kSection, GroupDebug)]
        [SettingsUIButton]
        public bool ResetDefaults
        {
            set
            {
                SetDefaults();
                ApplyAndSave();
            }
        }

        // ── About ─────────────────────────────────────────────────────────────

        [SettingsUISection(kSection, GroupAbout)]
        [SettingsUIMultilineText]
        public string AboutText => $"Tax & Production Mod  v{ModEntry.Version}\nAuthor: binded-zz\n\nManage tax rates and monitor production from a convenient in-game panel.";

        [SettingsUISection(kSection, GroupAbout)]
        [SettingsUIButton]
        public bool OpenSourceCode
        {
            set { }
        }

        public override void SetDefaults()
        {
            ButtonEnabled = true;
            DefaultTaxRate = 15;
            DebugMode = false;
        }
    }
}