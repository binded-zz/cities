using Colossal.UI.Binding;
using Game.UI;
using System.Diagnostics;

namespace CitiesSkylines2Mod
{
    public partial class TaxProductionUISystem : UISystemBase
    {
        private const string Group = "taxProduction";

        private bool m_IsVisible = false;
        private bool m_SettingsVisible = false;
        private float m_TaxRate = 0f;
        private bool m_ButtonEnabled = true;

        protected override void OnCreate()
        {
            base.OnCreate();

            var settings = ModEntry.Settings;
            m_ButtonEnabled = settings?.ButtonEnabled ?? true;
            m_TaxRate = settings?.DefaultTaxRate ?? 15;

            AddBinding(new GetterValueBinding<bool>(Group, "isVisible", () => m_IsVisible));
            AddBinding(new GetterValueBinding<bool>(Group, "settingsVisible", () => m_SettingsVisible));
            AddBinding(new GetterValueBinding<float>(Group, "taxRate", () => m_TaxRate));
            AddBinding(new GetterValueBinding<bool>(Group, "buttonEnabled", () => m_ButtonEnabled));

            AddBinding(new TriggerBinding(Group, "toggleWindow", ToggleWindow));
            AddBinding(new TriggerBinding(Group, "toggleSettings", ToggleSettings));
            AddBinding(new TriggerBinding<float>(Group, "setTaxRate", SetTaxRate));
            AddBinding(new TriggerBinding<bool>(Group, "setButtonEnabled", SetButtonEnabled));

            Log($"UISystem created — buttonEnabled={m_ButtonEnabled}, defaultTaxRate={m_TaxRate}");
            if (Debugger.IsAttached) Debugger.Break(); // BP1: system initialized — inspect m_ButtonEnabled, m_TaxRate
        }

        private void ToggleWindow()
        {
            if (Debugger.IsAttached) Debugger.Break(); // BP2: button clicked — trigger reached C#
            m_IsVisible = !m_IsVisible;
            Log($"toggleWindow → isVisible={m_IsVisible}");
        }

        private void ToggleSettings()
        {
            if (Debugger.IsAttached) Debugger.Break(); // BP3: gear clicked — trigger reached C#
            m_SettingsVisible = !m_SettingsVisible;
            Log($"toggleSettings → settingsVisible={m_SettingsVisible}");
        }

        private void SetTaxRate(float rate)
        {
            if (rate >= 0f && rate <= 100f)
            {
                m_TaxRate = rate;
                Log($"setTaxRate → {m_TaxRate}");
            }
        }

        private void SetButtonEnabled(bool enabled)
        {
            m_ButtonEnabled = enabled;
            if (!enabled) m_IsVisible = false;
            Log($"setButtonEnabled → {m_ButtonEnabled}");

            if (ModEntry.Settings != null)
            {
                ModEntry.Settings.ButtonEnabled = enabled;
                ModEntry.Settings.ApplyAndSave();
            }
        }

        private static void Log(string msg)
        {
            if (ModEntry.Settings?.DebugMode == true)
                ModEntry.log.Info($"[TaxProduction] {msg}");
        }
    }
}
