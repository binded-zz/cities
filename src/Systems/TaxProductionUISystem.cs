using Colossal.UI.Binding;
using Game.UI;
using UnityEngine;

namespace CitiesSkylines2Mod
{
    public partial class TaxProductionUISystem : UISystemBase
    {
        private const string Group = "taxProduction";

        private ValueBinding<bool> m_IsVisibleBinding;
        private ValueBinding<bool> m_SettingsVisibleBinding;
        private ValueBinding<float> m_TaxRateBinding;
        private ValueBinding<bool> m_ButtonEnabledBinding;

        protected override void OnCreate()
        {
            base.OnCreate();

            var settings = ModEntry.Settings;
            var buttonEnabled = settings?.ButtonEnabled ?? true;
            var taxRate = (float)(settings?.DefaultTaxRate ?? 15);

            m_IsVisibleBinding = new ValueBinding<bool>(Group, "isVisible", false);
            m_SettingsVisibleBinding = new ValueBinding<bool>(Group, "settingsVisible", false);
            m_TaxRateBinding = new ValueBinding<float>(Group, "taxRate", taxRate);
            m_ButtonEnabledBinding = new ValueBinding<bool>(Group, "buttonEnabled", buttonEnabled);

            AddBinding(m_IsVisibleBinding);
            AddBinding(m_SettingsVisibleBinding);
            AddBinding(m_TaxRateBinding);
            AddBinding(m_ButtonEnabledBinding);

            AddBinding(new TriggerBinding(Group, "toggleWindow", ToggleWindow));
            AddBinding(new TriggerBinding(Group, "toggleSettings", ToggleSettings));
            AddBinding(new TriggerBinding<float>(Group, "setTaxRate", SetTaxRate));
            AddBinding(new TriggerBinding<bool>(Group, "setButtonEnabled", SetButtonEnabled));

            Log($"OnCreate — buttonEnabled={buttonEnabled}, taxRate={taxRate}");
        }

        private void ToggleWindow()
        {
            var next = !m_IsVisibleBinding.value;
            m_IsVisibleBinding.Update(next);
            Log($"ToggleWindow → isVisible={next}");
        }

        private void ToggleSettings()
        {
            var next = !m_SettingsVisibleBinding.value;
            m_SettingsVisibleBinding.Update(next);
            Log($"ToggleSettings → settingsVisible={next}");
        }

        private void SetTaxRate(float rate)
        {
            if (rate >= 0f && rate <= 100f)
            {
                m_TaxRateBinding.Update(rate);
                Log($"SetTaxRate → {rate}");
            }
        }

        private void SetButtonEnabled(bool enabled)
        {
            m_ButtonEnabledBinding.Update(enabled);
            if (!enabled)
                m_IsVisibleBinding.Update(false);
            Log($"SetButtonEnabled → {enabled}");

            if (ModEntry.Settings != null)
            {
                ModEntry.Settings.ButtonEnabled = enabled;
                ModEntry.Settings.ApplyAndSave();
            }
        }

        private static void Log(string msg)
        {
            var text = $"[TaxProduction] {msg}";
            Debug.LogWarning(text);
            ModEntry.log.Info(text);
        }
    }
}
