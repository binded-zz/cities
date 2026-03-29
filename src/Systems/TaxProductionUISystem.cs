using Colossal.UI.Binding;
using Game.UI;

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
            m_ButtonEnabled = ModEntry.Settings?.ButtonEnabled ?? true;

            AddBinding(new GetterValueBinding<bool>(Group, "isVisible", () => m_IsVisible));
            AddBinding(new GetterValueBinding<bool>(Group, "settingsVisible", () => m_SettingsVisible));
            AddBinding(new GetterValueBinding<float>(Group, "taxRate", () => m_TaxRate));
            AddBinding(new GetterValueBinding<bool>(Group, "buttonEnabled", () => m_ButtonEnabled));

            AddBinding(new TriggerBinding(Group, "toggleWindow", ToggleWindow));
            AddBinding(new TriggerBinding(Group, "toggleSettings", ToggleSettings));
            AddBinding(new TriggerBinding<float>(Group, "setTaxRate", SetTaxRate));
            AddBinding(new TriggerBinding<bool>(Group, "setButtonEnabled", SetButtonEnabled));
        }

        private void ToggleWindow()
        {
            m_IsVisible = !m_IsVisible;
        }

        private void ToggleSettings()
        {
            m_SettingsVisible = !m_SettingsVisible;
        }

        private void SetTaxRate(float rate)
        {
            if (rate >= 0f && rate <= 100f)
                m_TaxRate = rate;
        }

        private void SetButtonEnabled(bool enabled)
        {
            m_ButtonEnabled = enabled;
            if (!enabled)
                m_IsVisible = false;
        }
    }
}
